export function safeParseUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

export function getHostname(url: string): string {
  const u = safeParseUrl(url);
  return u?.hostname ?? "";
}

export function truncateUrl(url: string, maxLength: number): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 3) + "...";
}

export function normalizeHostname(hostname: string): string {
  const h = hostname.toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

/**
 * Domain filter matching rule (premium feel):
 * - selecting "example.com" matches:
 *   - example.com
 *   - www.example.com
 *   - any.sub.example.com
 */
export function matchesDomain(hostname: string, domain: string): boolean {
  const h = normalizeHostname(hostname);
  const d = normalizeHostname(domain);

  if (!h || !d) return false;
  if (h === d) return true;
  return h.endsWith("." + d);
}

/**
 * Chrome-built-in favicon endpoint (works inside extensions).
 * Using size 16 for list; can increase later.
 */
export function faviconUrlFor(pageUrl: string, size = 16): string {
  // MV3 favicon endpoint:
  // chrome-extension://<id>/_favicon/?pageUrl=<...>&size=<...>
  const base = chrome.runtime.getURL("/_favicon/")
  const u = new URL(base)
  u.searchParams.set("pageUrl", pageUrl)
  u.searchParams.set("size", String(size))
  return u.toString()
}
