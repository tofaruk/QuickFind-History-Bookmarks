import { useEffect, useMemo, useState } from "react"
import type { FilterState } from "../../domain/types/filter"
import type { ResultItem } from "../../domain/types/result"
import { searchHistory } from "../../services/chrome/historyService"
import { searchBookmarks } from "../../services/chrome/bookmarkService"
import { useDebouncedValue } from "./useDebouncedValue"

const FETCH_LIMIT = 200

export function useSearchResults(filters: FilterState) {
  const [baseResults, setBaseResults] = useState<ResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebouncedValue(filters.query, 200)

  // Fetch filters ignore "limit" to prevent refetch on limit changes
  const fetchFilters = useMemo<FilterState>(
    () => ({ ...filters, query: debouncedQuery, limit: FETCH_LIMIT }),
    // IMPORTANT: exclude filters.limit
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.query, debouncedQuery, filters.scope, filters.domain, filters.timeRange],
  )

  useEffect(() => {
    const q = fetchFilters.query.trim()
    const hasDomain = !!fetchFilters.domain

    if (q.length === 0 && !hasDomain) {
      setBaseResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    async function run() {
      try {
        setIsLoading(true)
        setError(null)

        const parts: ResultItem[] = []

        if (fetchFilters.scope === "history" || fetchFilters.scope === "both") {
          parts.push(...(await searchHistory(fetchFilters)))
        }

        if (fetchFilters.scope === "bookmarks" || fetchFilters.scope === "both") {
          parts.push(...(await searchBookmarks(fetchFilters)))
        }

        const merged =
          fetchFilters.scope === "both"
            ? [
                ...parts.filter((p) => p.kind === "history"),
                ...parts.filter((p) => p.kind === "bookmark"),
              ]
            : parts

        if (!cancelled) setBaseResults(merged)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [fetchFilters])

  // Slice locally for UI limit (no refetch)
  const results = useMemo(() => baseResults.slice(0, filters.limit), [baseResults, filters.limit])

  return { results, isLoading, error }
}
