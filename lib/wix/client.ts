/**
 * Wix REST client — shared by the catalogue and journal adapters.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO WAYS TO AUTHENTICATE
 * ─────────────────────────────────────────────────────────────────────────────
 * Both are supported. The client picks whichever is configured, preferring the
 * API key when both are present.
 *
 *   1. API KEY + SITE ID   (WIX_API_KEY, WIX_SITE_ID)
 *      Headers: `Authorization: <key>` and `wix-site-id: <id>`.
 *      One request per call, no token exchange. This is an ACCOUNT-LEVEL
 *      ADMIN credential: it can read and write everything on the site,
 *      including orders and customer data. It must never reach the browser.
 *      Every module that imports this file is server-only — no `NEXT_PUBLIC_`
 *      prefix, no import from a `'use client'` component. Check that before
 *      you add a caller.
 *
 *   2. CLIENT ID           (WIX_CLIENT_ID)
 *      Anonymous visitor tokens, minted from the headless OAuth client ID and
 *      cached for their 4-hour life. Read-only over published content, which
 *      is all this site needs, so it is the safer option if you ever want to
 *      drop the admin key.
 *
 * All reads are cached with `next: { revalidate, tags }` so pages stay
 * statically served. Edits in Wix appear within WIX_REVALIDATE_SECONDS.
 */

import 'server-only';

const API_BASE = process.env.WIX_API_BASE ?? 'https://www.wixapis.com';

/** ISR window for Wix reads. 15 minutes unless overridden. */
export const WIX_REVALIDATE = Number(process.env.WIX_REVALIDATE_SECONDS ?? 900);

/* -------------------------------------------------------------------------- */
/*  Configuration                                                              */
/* -------------------------------------------------------------------------- */

type WixAuth =
  | { kind: 'api-key'; apiKey: string; siteId: string }
  | { kind: 'visitor'; clientId: string };

function readAuth(): WixAuth {
  const apiKey = process.env.WIX_API_KEY?.trim();
  const siteId = process.env.WIX_SITE_ID?.trim();
  const clientId = process.env.WIX_CLIENT_ID?.trim();

  if (apiKey && siteId) return { kind: 'api-key', apiKey, siteId };
  if (clientId) return { kind: 'visitor', clientId };

  // A key with no site ID is the likeliest misconfiguration, so name it.
  if (apiKey && !siteId) {
    throw new Error(
      'WIX_API_KEY is set but WIX_SITE_ID is missing. Site-level Wix calls need ' +
        'both. See .env.example.',
    );
  }

  throw new Error(
    'Wix is selected as a backend but no credentials are set. Provide either ' +
      'WIX_API_KEY + WIX_SITE_ID, or WIX_CLIENT_ID. See .env.example.',
  );
}

/** True when Wix can actually be reached, without throwing. For diagnostics. */
export function isWixConfigured(): boolean {
  try {
    readAuth();
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Visitor tokens                                                             */
/* -------------------------------------------------------------------------- */

let tokenCache: { value: string; expiresAt: number } | null = null;
let inFlight: Promise<string> | null = null;

async function visitorToken(clientId: string): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.value;
  // Collapse concurrent misses onto a single request.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const res = await fetch(`${API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, grantType: 'anonymous' }),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(
        `Wix visitor token request failed (${res.status}). Check WIX_CLIENT_ID ` +
          'and that the OAuth app is enabled in Headless Settings.',
      );
    }

    const json = (await res.json()) as { access_token: string; expires_in: number };
    // Refresh a minute early so a request never rides an expiring token.
    tokenCache = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in - 60) * 1000,
    };
    return tokenCache.value;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

async function authHeaders(auth: WixAuth): Promise<Record<string, string>> {
  if (auth.kind === 'api-key') {
    return { Authorization: auth.apiKey, 'wix-site-id': auth.siteId };
  }
  return { Authorization: await visitorToken(auth.clientId) };
}

/* -------------------------------------------------------------------------- */
/*  Transport                                                                  */
/* -------------------------------------------------------------------------- */

export async function wixFetch<T>(
  path: string,
  init: {
    method: 'GET' | 'POST';
    body?: unknown;
    /** Cache tag, so a future webhook route can purge just this data. */
    tag: string;
  },
  retryOnAuthFailure = true,
): Promise<T> {
  const auth = readAuth();

  const res = await fetch(`${API_BASE}${path}`, {
    method: init.method,
    headers: { ...(await authHeaders(auth)), 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    next: { revalidate: WIX_REVALIDATE, tags: [init.tag] },
  });

  // A cached visitor token can outlive its session. Drop it and try once more.
  // An API key that 401s is simply wrong, so there is nothing to retry.
  if (res.status === 401 && retryOnAuthFailure && auth.kind === 'visitor') {
    tokenCache = null;
    return wixFetch<T>(path, init, false);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(
      `Wix ${init.method} ${path} failed (${res.status}) using ${auth.kind} auth. ` +
        detail.slice(0, 300),
    );
  }

  return (await res.json()) as T;
}

/* -------------------------------------------------------------------------- */
/*  Shared media helpers                                                       */
/* -------------------------------------------------------------------------- */

export type WixImage = {
  url?: string;
  width?: number;
  height?: number;
  altText?: string;
};

/**
 * Wix serves images from static.wixstatic.com at their original dimensions;
 * next/image handles resizing from there. `next.config.ts` allows that host.
 */
export function toImage(
  image: WixImage | undefined,
  fallbackAlt: string,
  explicitAlt?: string,
) {
  if (!image?.url) return null;
  return {
    url: image.url,
    // An empty alt on a product photo is an accessibility failure — fall back
    // to the item's name rather than shipping "".
    alt: explicitAlt || image.altText || fallbackAlt,
    width: image.width ?? 1000,
    height: image.height ?? 1000,
  };
}
