import { getHostname, normalizeHostname } from "../../domain/utils/url"

function assertChromeHistoryAvailable() {
  if (typeof chrome === "undefined" || !chrome.history?.search) {
    throw new Error("chrome.history API is not available in this context.")
  }
}

export type DomainOption = {
  hostname: string
  count: number
}

/**
 * Returns top domains from recent history (default: last 14 days).
 * Used for the "Site" dropdown.
 */
export async function getTopDomains(options?: {
  maxHistoryItems?: number
  maxDomains?: number
  startTime?: number
}): Promise<DomainOption[]> {
  assertChromeHistoryAvailable()

  const maxHistoryItems = options?.maxHistoryItems ?? 2000
  const maxDomains = options?.maxDomains ?? 20
  const startTime =
    options?.startTime ?? Date.now() - 1000 * 60 * 60 * 24 * 14 // last 14 days

  const items: chrome.history.HistoryItem[] = await new Promise((resolve, reject) => {
    chrome.history.search(
      { text: "", startTime, maxResults: maxHistoryItems },
      (res: chrome.history.HistoryItem[]) => {
        const err = chrome.runtime?.lastError
        if (err) reject(new Error(err.message))
        else resolve(res ?? [])
      },
    )
  })

  const counts = new Map<string, number>()

  for (const it of items) {
    if (!it.url) continue
    const host = normalizeHostname(getHostname(it.url))
    if (!host) continue
    counts.set(host, (counts.get(host) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([hostname, count]) => ({ hostname, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxDomains)
}
