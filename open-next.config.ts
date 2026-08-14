import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Defaults are right for this site: ISR pages are served from the Workers
// assets/cache layer and revalidated on the WIX_REVALIDATE_SECONDS window set
// in lib/wix. Add an incrementalCache here only if that stops being enough.
export default defineCloudflareConfig();
