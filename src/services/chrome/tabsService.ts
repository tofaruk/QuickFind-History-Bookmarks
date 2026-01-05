import type { FilterState } from "../../domain/types/filter";
import type { ResultItem } from "../../domain/types/result";
import {
  faviconUrlFor,
  getHostname,
  matchesDomain,
} from "../../domain/utils/url";

export async function openUrl(url: string): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.tabs?.create) {
    throw new Error("chrome.tabs API is not available.");
  }

  await new Promise<void>((resolve, reject) => {
    chrome.tabs.create({ url }, () => {
      const err = chrome.runtime?.lastError;
      if (err) reject(new Error(err.message));
      else resolve();
    });
  });
}

export async function focusTab(
  tabId: number,
  windowId?: number
): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.tabs?.update) {
    throw new Error("chrome.tabs API is not available.");
  }

  await new Promise<void>((resolve, reject) => {
    chrome.tabs.update(tabId, { active: true }, () => {
      const err = chrome.runtime?.lastError;
      if (err) reject(new Error(err.message));
      else resolve();
    });
  });

  if (windowId != null && chrome.windows?.update) {
    await new Promise<void>((resolve, reject) => {
      chrome.windows.update(windowId, { focused: true }, () => {
        const err = chrome.runtime?.lastError;
        if (err) reject(new Error(err.message));
        else resolve();
      });
    });
  }
}

function assertTabsAvailable() {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) {
    throw new Error("chrome.tabs.query API is not available.");
  }
}

function norm(s: string): string {
  return s.toLowerCase().trim();
}

export async function searchOpenTabs(
  filters: FilterState
): Promise<ResultItem[]> {
  assertTabsAvailable();

  const q = norm(filters.query);
  const domain = filters.domain?.trim() || null;

  // If query empty AND no domain: do not list everything
  // if (!q && !domain) return [];

  const tabs: chrome.tabs.Tab[] = await new Promise((resolve, reject) => {
    chrome.tabs.query({}, (res) => {
      const err = chrome.runtime?.lastError;
      if (err) reject(new Error(err.message));
      else resolve(res ?? []);
    });
  });

  const results: ResultItem[] = tabs
    .filter((t) => !!t.url)
    .map((t) => {
      const url = t.url as string;
      const hostname = getHostname(url);

      return {
        id: `t:${t.id ?? url}`,
        kind: "tab" as const, // (we’ll treat tabs as its own kind in the next step)
        tabId: t.id,
        windowId: t.windowId,
        title: t.title && t.title.trim().length > 0 ? t.title : url,
        url,
        hostname,
        faviconUrl: t.favIconUrl || faviconUrlFor(url, 16),
        metaLine: "Open tab",
        // store tabId/windowId via metaLine is not ideal, so we’ll add fields below in Step 7.2
      };
    });

  // filter by domain (if set)
  const domainFiltered = domain
    ? results.filter((r) => matchesDomain(r.hostname, domain))
    : results;

  // filter by query against title/url
  const queryFiltered = q
    ? domainFiltered.filter(
        (r) => norm(r.title).includes(q) || norm(r.url).includes(q)
      )
    : domainFiltered;

  return queryFiltered.slice(0, filters.limit);
}
