/**
 * KSHYOVRATA — content adapter
 *
 * The journal's equivalent of `lib/commerce`. No page imports `lib/journal`
 * directly; everything goes through the `ContentAdapter` contract, so the
 * posts can come from a TypeScript file or from Wix Blog without a single
 * page changing.
 *
 * Selected by CONTENT_BACKEND:
 *
 *   local  the eight launch posts in lib/journal.ts (default)
 *   wix    Wix Blog v3 — lib/content/wix.ts
 *
 * It is deliberately separate from COMMERCE_BACKEND. The shop and the journal
 * are edited by different people at different times, and being able to move
 * one to Wix without the other is worth one extra environment variable.
 */

import type { JournalPost } from '../types';
import { localContent } from './local';
import { wixContent } from './wix';

export interface ContentAdapter {
  readonly backend: string;
  listPosts(): Promise<JournalPost[]>;
  getPost(slug: string): Promise<JournalPost | null>;
  getRelatedPosts(slug: string, limit?: number): Promise<JournalPost[]>;
  /** Every post slug, for generateStaticParams and the sitemap. */
  listPostSlugs(): Promise<string[]>;
}

function selectAdapter(): ContentAdapter {
  const backend = process.env.CONTENT_BACKEND?.trim().toLowerCase();

  switch (backend) {
    case 'wix':
      return wixContent;
    case undefined:
    case '':
    case 'local':
      return localContent;
    default:
      console.warn(
        `[content] CONTENT_BACKEND="${backend}" is not a known backend ` +
          '(local | wix). Falling back to the local journal.',
      );
      return localContent;
  }
}

export const content: ContentAdapter = selectAdapter();

export type { JournalPost };
