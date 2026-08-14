/**
 * Local journal adapter.
 *
 * Serves the eight launch posts straight from `lib/journal.ts`. Pure and
 * synchronous underneath, wrapped in promises to match the contract the Wix
 * adapter satisfies.
 */

import { JOURNAL, getPost, getRelatedPosts } from '../journal';
import type { ContentAdapter } from './index';

export const localContent: ContentAdapter = {
  backend: 'local',

  async listPosts() {
    return JOURNAL;
  },

  async getPost(slug) {
    return getPost(slug) ?? null;
  },

  async getRelatedPosts(slug, limit = 2) {
    return getRelatedPosts(slug).slice(0, limit);
  },

  async listPostSlugs() {
    return JOURNAL.map((p) => p.slug);
  },
};
