import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import { ScopeTabs } from "../components/ScopeTabs"
import { FilterRow } from "../components/FilterRow"
import { ResultsList } from "../components/ResultsList"
import type { FilterState, Scope } from "../../domain/types/filter"
import { DEFAULT_FILTERS } from "../../domain/utils/defaultFilters"
import { useSearchResults } from "../hooks/useSearchResults"
import { openUrl } from "../../services/chrome/tabsService"
import type { DomainOption } from "../../services/chrome/domainService"
import { getTopDomains } from "../../services/chrome/domainService"

export function PopupShell() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [domainOptions, setDomainOptions] = useState<DomainOption[]>([])

  const scopeValue: Scope = filters.scope
  const trimmedQuery = useMemo(() => filters.query.trim(), [filters.query])

  const { results, isLoading, error } = useSearchResults(filters)

  useEffect(() => {
    let cancelled = false
    getTopDomains({ maxDomains: 24 })
      .then((opts) => {
        if (!cancelled) setDomainOptions(opts)
      })
      .catch(() => {
        // If it fails (rare), we still have a functional "All sites" experience.
      })
    return () => {
      cancelled = true
    }
  }, [])

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
        onTimeClick={() => {
          // next step: real time dropdown
          // placeholder: toggle today <-> thisWeek for quick testing
          setFilters((prev) => ({
            ...prev,
            timeRange: prev.timeRange.kind === "today" ? { kind: "thisWeek" } : { kind: "today" },
          }))
        }}
        onLimitClick={() => {
          // next step: real limit dropdown
          // placeholder: toggle 50 <-> 100
          setFilters((prev) => ({ ...prev, limit: prev.limit === 50 ? 100 : 50 }))
        }}
      />

      <div className="min-h-0 flex-1">
        <ResultsList
          query={trimmedQuery}
          results={results}
          isLoading={isLoading}
          error={error}
          onOpenUrl={(url) => openUrl(url)}
        />
      </div>

      <footer className="flex items-center justify-between text-xs text-gray-500">
        <span>Domain filter is live ✅</span>
        <span>{filters.scope.toUpperCase()}</span>
      </footer>
    </div>
  )
}
