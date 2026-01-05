import type { FilterState } from "../../domain/types/filter"
import type { ResultItem } from "../../domain/types/result"
import { faviconUrlFor, getHostname, matchesDomain } from "../../domain/utils/url"
import { toHistoryTimeWindow } from "../../domain/utils/timeRanges"

function assertChromeHistoryAvailable() {
  if (typeof chrome === "undefined" || !chrome.history?.search) {
    throw new Error("chrome.history API is not available in this context.")
  }
}

export async function searchHistory(filters: FilterState): Promise<ResultItem[]> {
  assertChromeHistoryAvailable()

  const query = filters.query.trim()
  const { startTime, endTime } = toHistoryTimeWindow(filters.timeRange)

  // Note: chrome.history.search requires a "text" string; empty returns all in range.
  const raw: chrome.history.HistoryItem[] = await new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: query,
        startTime,
        endTime,
        maxResults: Math.max(filters.limit * 3, 200), // fetch extra; we’ll filter + then slice
      },
      (items) => {
        const err = chrome.runtime?.lastError
        if (err) reject(new Error(err.message))
        else resolve(items ?? [])
      },
    )
  })

  const domain = filters.domain?.trim() || null

  // Normalize into ResultItem + apply domain filter.
  const mapped = raw
    .filter((it) => !!it.url)
    .map((it) => {
      const url = it.url as string
      const hostname = getHostname(url)

      return {
        id: `h:${it.id ?? url}`,
        kind: "history" as const,
        title: (it.title && it.title.trim().length > 0) ? it.title : url,
        url,
        hostname,
        faviconUrl: faviconUrlFor(url, 16),
        lastVisitTime: it.lastVisitTime,
        metaLine: it.lastVisitTime ? `Last visit: ${new Date(it.lastVisitTime).toLocaleString()}` : undefined,
      } satisfies ResultItem
    })
    .filter((r) => {
      if (!domain) return true
      return matchesDomain(r.hostname, domain)
    })
    .sort((a, b) => (b.lastVisitTime ?? 0) - (a.lastVisitTime ?? 0))
    .slice(0, filters.limit)

  return mapped
}
