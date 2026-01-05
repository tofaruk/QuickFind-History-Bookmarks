import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import { ScopeTabs } from "../components/ScopeTabs"
import { FilterRow } from "../components/FilterRow"
import { ResultsList } from "../components/ResultsList"
import { ConfirmDialog } from "../components/ConfirmDialog"

import type { FilterState, Scope } from "../../domain/types/filter"
import { DEFAULT_FILTERS } from "../../domain/utils/defaultFilters"
import { useSearchResults } from "../hooks/useSearchResults"

import type { DomainOption } from "../../services/chrome/domainService"
import { getTopDomains } from "../../services/chrome/domainService"

import type { ResultItem } from "../../domain/types/result"
import { deleteHistoryUrls } from "../../services/chrome/historyService"
import { deleteBookmarkIds } from "../../services/chrome/bookmarkService"
import { toBookmarkId } from "../../domain/utils/resultIds"
import { focusTab, openUrl } from "../../services/chrome/tabsService"
export function PopupShell() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [domainOptions, setDomainOptions] = useState<DomainOption[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [refreshToken, setRefreshToken] = useState(0)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void>)>(null)

  const scopeValue: Scope = filters.scope
  const trimmedQuery = useMemo(() => filters.query.trim(), [filters.query])

  const { results, isLoading, error } = useSearchResults(filters, refreshToken)

  // Load domain options once
  useEffect(() => {
    let cancelled = false
    getTopDomains({ maxDomains: 24 })
      .then((opts) => {
        if (!cancelled) setDomainOptions(opts)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // If results change due to filter changes, keep selection only for visible ids
  useEffect(() => {
    const visible = new Set(results.map((r) => r.id))
    setSelectedIds((prev) => {
      const next = new Set<string>()
      for (const id of prev) if (visible.has(id)) next.add(id)
      return next
    })
  }, [results])

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllVisible() {
    setSelectedIds(new Set(results.map((r) => r.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function requestConfirm(title: string, message: string, action: () => Promise<void>) {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setConfirmOpen(true)
  }

  async function runDelete(items: ResultItem[]) {
    const urlsToDelete: string[] = []
    const bookmarkIdsToDelete: string[] = []

    for (const it of items) {
      if (it.kind === "history") {
        urlsToDelete.push(it.url)
      } else if (it.kind === "bookmark") {
        const bid = toBookmarkId(it.id)
        if (bid) bookmarkIdsToDelete.push(bid)
      }
    }

    // Perform deletions
    if (urlsToDelete.length) await deleteHistoryUrls(urlsToDelete)
    if (bookmarkIdsToDelete.length) await deleteBookmarkIds(bookmarkIdsToDelete)

    // Clear selection + refresh results
    clearSelection()
    setRefreshToken((n) => n + 1)
  }

  function requestDeleteOne(item: ResultItem) {
    requestConfirm(
      "Delete item?",
      `This will remove this ${item.kind} entry.\n\n${item.url}`,
      async () => {
        await runDelete([item])
      },
    )
  }

  function requestDeleteSelected() {
    const selected = results.filter((r) => selectedIds.has(r.id))
    if (selected.length === 0) return

    requestConfirm(
      `Delete selected (${selected.length})?`,
      `This will delete ${selected.length} item(s) from ${filters.scope === "all" ? "History and/or Bookmarks" : filters.scope}.`,
      async () => {
        await runDelete(selected)
      },
    )
  }

  function requestDeleteVisible() {
    if (results.length === 0) return
    requestConfirm(
      `Delete visible (${results.length})?`,
      `This will delete all currently visible results (${results.length}).`,
      async () => {
        await runDelete(results)
      },
    )
  }

  const selectedCount = selectedIds.size

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-900">
            QuickFind: History &amp; Bookmarks
          </div>
          <div className="text-xs text-gray-500">
            Fast search with premium filters
          </div>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          v2
        </div>
      </header>

      <SearchBar
        value={filters.query}
        onChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
        onClear={() => setFilters((prev) => ({ ...prev, query: "" }))}
      />

      <ScopeTabs
        value={scopeValue}
        onChange={(s) => setFilters((prev) => ({ ...prev, scope: s }))}
      />

      <FilterRow
        domain={filters.domain}
        timeRange={filters.timeRange}
        limit={filters.limit}
        domainOptions={domainOptions}
        onDomainChange={(d) => setFilters((prev) => ({ ...prev, domain: d }))}
        onTimeRangeChange={(tr) => setFilters((prev) => ({ ...prev, timeRange: tr }))}
        onLimitChange={(limit) => setFilters((prev) => ({ ...prev, limit }))}
      />

      {/* Bulk actions bar */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>
            Selected: <span className="font-semibold text-gray-900">{selectedCount}</span>
          </span>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={requestDeleteSelected}
            disabled={selectedCount === 0}
            className={[
              "rounded-xl px-3 py-2 text-xs text-white",
              selectedCount === 0 ? "bg-gray-300" : "bg-red-600 hover:bg-red-700",
            ].join(" ")}
            title="Delete selected items"
          >
            Remove selected ({selectedCount})
          </button>

          <button
            type="button"
            onClick={requestDeleteVisible}
            disabled={results.length === 0}
            className={[
              "rounded-xl px-3 py-2 text-xs text-white",
              results.length === 0 ? "bg-gray-300" : "bg-gray-900 hover:bg-gray-800",
            ].join(" ")}
            title="Delete all visible results"
          >
            Remove visible ({results.length})
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ResultsList
          query={trimmedQuery}
          results={results}
          isLoading={isLoading}
          error={error}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onSelectAllVisible={selectAllVisible}
          onClearSelection={clearSelection}
          onOpenItem={async (item) => {
            if (item.kind === "tab" && item.tabId != null) {
              await focusTab(item.tabId, item.windowId)
              return
            }
            await openUrl(item.url)
          }}
          onRequestDeleteOne={requestDeleteOne}
        />
      </div>

      <footer className="flex items-center justify-between text-xs text-gray-500">
        <span>Bulk delete is live ✅</span>
        <span>{filters.scope.toUpperCase()}</span>
      </footer>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false)
          const act = confirmAction
          if (act) await act()
        }}
      />
    </div>
  )
}
