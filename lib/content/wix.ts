/**
 * Wix Blog adapter.
 *
 * Verified against the live site: eight published posts, each authored in the
 * Wix editor as Ricos rich content that maps cleanly onto our `JournalBlock`
 * union — paragraphs, H2s, bulleted lists and a closing blockquote.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY RICH CONTENT AND NOT contentText
 * ─────────────────────────────────────────────────────────────────────────────
 * Wix will also return a `contentText` string, which is far simpler to consume
 * and completely wrong for this site: it flattens headings and list items into
 * one run-on paragraph. The journal's whole argument is that these posts are
 * more useful than the listicles ranking against them, and a wall of text
 * undoes that. So we request `RICH_CONTENT` and walk the node tree.
 *
 * Unmapped node types (images, videos, embeds, tables) are dropped rather than
 * rendered as something they aren't. If a post starts using them, extend
 * `fromRicos()` and the `JournalBlock` union together — silently swallowing an
 * image the author placed is a bug, so it logs.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SLUGS
 * ─────────────────────────────────────────────────────────────────────────────
 * Wix slugs are longer than the hand-written ones in `lib/journal.ts`
 * (`how-to-keep-gold-plated-jewellery-from-tarnishing` vs
 * `keep-gold-plated-jewellery-from-tarnishing`). With this backend the Wix
 * slug is the URL, because one source of truth beats an alias table that
 * silently rots. `next.config.ts` redirects the old paths so nothing 404s.
 */

import { wixFetch } from '../wix/client';
import type { JournalBlock, JournalPost } from '../types';
import type { ContentAdapter } from './index';

const TAG = 'wix-posts';

/* -------------------------------------------------------------------------- */
/*  Ricos shapes — only what we read                                           */
/* -------------------------------------------------------------------------- */

type RicosNode = {
  type?: string;
  nodes?: RicosNode[];
  textData?: { text?: string };
  headingData?: { level?: number };
};

type WixPost = {
  title?: string;
  excerpt?: string;
  slug?: string;
  firstPublishedDate?: string;
  minutesToRead?: number;
  richContent?: { nodes?: RicosNode[] };
  seoData?: { tags?: { type?: string; props?: Record<string, string> }[] };
};

/* -------------------------------------------------------------------------- */
/*  Ricos → JournalBlock                                                       */
/* -------------------------------------------------------------------------- */

/** Concatenate every TEXT descendant of a node. */
function textOf(node: RicosNode): string {
  if (node.type === 'TEXT') return node.textData?.text ?? '';
  return (node.nodes ?? []).map(textOf).join('');
}

const unmapped = new Set<string>();

function fromRicos(nodes: RicosNode[], slug: string): JournalBlock[] {
  const blocks: JournalBlock[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case 'PARAGRAPH': {
        const text = textOf(node).trim();
        // Ricos emits empty paragraphs as spacing; they are not content.
        if (text) blocks.push({ type: 'p', text });
        break;
      }

      case 'HEADING': {
        const text = textOf(node).trim();
        // The union only has h2. A deeper heading is still a section break, so
        // flattening it is better than dropping the author's structure.
        if (text) blocks.push({ type: 'h2', text });
        break;
      }

      case 'BULLETED_LIST':
      case 'ORDERED_LIST': {
        const items = (node.nodes ?? [])
          .map((item) => textOf(item).trim())
          .filter(Boolean);
        if (items.length) blocks.push({ type: 'list', items });
        break;
      }

      case 'BLOCKQUOTE': {
        const text = textOf(node).trim();
        if (text) blocks.push({ type: 'note', text });
        break;
      }

      default: {
        const key = `${slug}:${node.type}`;
        if (node.type && !unmapped.has(key)) {
          unmapped.add(key);
          console.warn(
            `[content/wix] Post "${slug}" contains a ${node.type} node, which has ` +
              'no equivalent in JournalBlock and was dropped. Extend fromRicos() ' +
              'and the JournalBlock union in lib/types.ts to render it.',
          );
        }
      }
    }
  }

  return blocks;
}

/* -------------------------------------------------------------------------- */
/*  Mapping                                                                    */
/* -------------------------------------------------------------------------- */

function metaDescription(post: WixPost): string | undefined {
  return post.seoData?.tags?.find((t) => t.props?.name === 'description')?.props
    ?.content;
}

function fromWix(post: WixPost): JournalPost | null {
  const slug = post.slug;
  const title = post.title?.trim();
  if (!slug || !title) return null;

  return {
    slug,
    title,
    // `targetQuery` drives SEO copy. Wix has no field for it, so the post's
    // own meta description is the closest honest equivalent, and the excerpt
    // after that — never a guess assembled from the title.
    targetQuery: metaDescription(post) ?? post.excerpt?.trim() ?? title,
    excerpt: post.excerpt?.trim() ?? '',
    publishedAt: (post.firstPublishedDate ?? '').slice(0, 10),
    readingMinutes: post.minutesToRead ?? 1,
    body: fromRicos(post.richContent?.nodes ?? [], slug),
    // Wix's own relatedPostIds are unset on this site. `getRelatedPosts` below
    // falls back to recency rather than leaving the section empty.
    relatedSlugs: [],
  };
}

/* -------------------------------------------------------------------------- */
/*  Reads                                                                      */
/* -------------------------------------------------------------------------- */

type QueryResponse = { posts?: WixPost[] };

async function queryPosts(filter?: Record<string, unknown>): Promise<JournalPost[]> {
  const json = await wixFetch<QueryResponse>('/blog/v3/posts/query', {
    method: 'POST',
    body: {
      fieldsets: ['RICH_CONTENT', 'SEO'],
      query: {
        ...(filter ? { filter } : {}),
        paging: { limit: 100 },
        // Newest first, matching how the journal index reads.
        sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
      },
    },
    tag: TAG,
  });

  return (json.posts ?? []).map(fromWix).filter((p): p is JournalPost => p !== null);
}

export const wixContent: ContentAdapter = {
  backend: 'wix',

  async listPosts() {
    return queryPosts();
  },

  async getPost(slug) {
    const posts = await queryPosts({ slug: { $eq: slug } });
    return posts[0] ?? null;
  },

  async getRelatedPosts(slug, limit = 2) {
    // No editorial pairings in Wix, so: the next posts in publication order,
    // wrapping around, which at least never repeats the post you're reading.
    const all = await queryPosts();
    const index = all.findIndex((p) => p.slug === slug);
    if (index === -1) return all.slice(0, limit);

    const rotated = [...all.slice(index + 1), ...all.slice(0, index)];
    return rotated.slice(0, limit);
  },

  async listPostSlugs() {
    return (await queryPosts()).map((p) => p.slug);
  },
};
