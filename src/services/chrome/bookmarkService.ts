import type { FilterState } from "../../domain/types/filter"
import type { ResultItem } from "../../domain/types/result"
import { faviconUrlFor, getHostname, matchesDomain } from "../../domain/utils/url"

function assertChromeBookmarksAvailable() {
  if (typeof chrome === "undefined" || !chrome.bookmarks?.getTree) {
    throw new Error("chrome.bookmarks API is not available in this context.")
  }
}

/**
 * Build an index of all bookmark nodes + a parent map.
 * This is fast enough for typical bookmark sizes and keeps logic simple.
 */
async function getBookmarksTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  assertChromeBookmarksAvailable()

  return await new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((nodes) => {
      const err = chrome.runtime?.lastError
      if (err) reject(new Error(err.message))
      else resolve(nodes ?? [])
    })
  })
}

type Index = {
  byId: Map<string, chrome.bookmarks.BookmarkTreeNode>
  parentById: Map<string, string | null>
}

function buildIndex(tree: chrome.bookmarks.BookmarkTreeNode[]): Index {
  const byId = new Map<string, chrome.bookmarks.BookmarkTreeNode>()
  const parentById = new Map<string, string | null>()

  function walk(node: chrome.bookmarks.BookmarkTreeNode, parentId: string | null) {
    byId.set(node.id, node)
    parentById.set(node.id, parentId)

    if (node.children) {
      for (const child of node.children) walk(child, node.id)
    }
  }

  for (const root of tree) walk(root, null)

  return { byId, parentById }
}

function getFolderPath(
  nodeId: string,
  idx: Index,
  maxDepth = 50,
): string {
  const parts: string[] = []
  let currentId: string | null = nodeId
  let depth = 0

  // We want the folder chain, so we start from parent of the item.
  const startParent = idx.parentById.get(nodeId) ?? null
  currentId = startParent

  while (currentId && depth < maxDepth) {
    const n = idx.byId.get(currentId)
    if (!n) break
    if (n.title) parts.push(n.title)
    currentId = idx.parentById.get(currentId) ?? null
    depth++
  }

  parts.reverse()

  // Remove generic roots like "Bookmarks bar" / "Other bookmarks" if you want later.
  return parts.join(" / ")
}

function normalizeText(s: string): string {
  return s.toLowerCase().trim()
}

function includesNormalized(haystack: string, needle: string): boolean {
  if (!needle) return true
  return normalizeText(haystack).includes(needle)
}

/**
 * Matches the query against:
 * - bookmark title
 * - bookmark URL
 * - folder path (so folder name search works)
 */
function matchesBookmark(
  node: chrome.bookmarks.BookmarkTreeNode,
  folderPath: string,
  q: string,
): boolean {
  const title = node.title ?? ""
  const url = node.url ?? ""
  return (
    includesNormalized(title, q) ||
    includesNormalized(url, q) ||
    includesNormalized(folderPath, q)
  )
}

export async function searchBookmarks(filters: FilterState): Promise<ResultItem[]> {
  assertChromeBookmarksAvailable()

  const q = normalizeText(filters.query)
  const domain = filters.domain?.trim() || null

  // For premium UX: don’t return “everything” if query is empty.
  if (q.length === 0) return []

  const tree = await getBookmarksTree()
  const idx = buildIndex(tree)

  const results: ResultItem[] = []

  for (const [id, node] of idx.byId.entries()) {
    if (!node.url) continue // only bookmark items, not folders

    const url = node.url
    const hostname = getHostname(url)
    const folderPath = getFolderPath(id, idx)

    if (domain && !matchesDomain(hostname, domain)) continue
    if (!matchesBookmark(node, folderPath, q)) continue

    results.push({
      id: `b:${id}`,
      kind: "bookmark",
      title: node.title && node.title.trim().length > 0 ? node.title : url,
      url,
      hostname,
      faviconUrl: faviconUrlFor(url, 16),
      metaLine: folderPath ? `Folder: ${folderPath}` : "Folder: (root)",
    })
  }

  // Keep it stable & useful:
  // - If you want a smarter rank later, we’ll implement it. For now, sort by title.
  results.sort((a, b) => a.title.localeCompare(b.title))

  return results.slice(0, filters.limit)
}
