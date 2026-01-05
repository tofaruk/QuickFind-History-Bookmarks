import { useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import { ScopeTabs } from "../components/ScopeTabs"
import { FilterRow } from "../components/FilterRow"
import { ResultsList } from "../components/ResultsList"
import type { FilterState, Scope } from "../../domain/types/filter"
import { DEFAULT_FILTERS } from "../../domain/utils/defaultFilters"

export function PopupShell() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const scopeValue: Scope = filters.scope

  const trimmedQuery = useMemo(() => filters.query.trim(), [filters.query])

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-900">
            Quick Search
          </div>
          <div className="text-xs text-gray-500">
            History + Bookmarks • fast filters
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

      <FilterRow domain={filters.domain} timeRange={filters.timeRange} limit={filters.limit} />

      <div className="min-h-0 flex-1">
        <ResultsList query={trimmedQuery} />
      </div>

      <footer className="flex items-center justify-between text-xs text-gray-500">
        <span>Tip: Use Enter to open (coming soon)</span>
        <span>{filters.scope.toUpperCase()}</span>
      </footer>
    </div>
  )
}
