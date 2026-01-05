import { useEffect, useMemo, useState } from "react"
import type { FilterState } from "../../domain/types/filter"
import type { ResultItem } from "../../domain/types/result"
import { searchHistory } from "../../services/chrome/historyService"
import { useDebouncedValue } from "./useDebouncedValue"

export function useSearchResults(filters: FilterState) {
  const [results, setResults] = useState<ResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebouncedValue(filters.query, 200)

  const effectiveFilters = useMemo<FilterState>(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  )

  useEffect(() => {
    const q = effectiveFilters.query.trim()

    // For premium UX: don’t search until user types something.
    if (q.length === 0) {
      setResults([])
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

        if (effectiveFilters.scope === "history" || effectiveFilters.scope === "both") {
          parts.push(...(await searchHistory(effectiveFilters)))
        }

        // Bookmarks next step
        // if (effectiveFilters.scope === "bookmarks" || effectiveFilters.scope === "both") { ... }

        if (!cancelled) setResults(parts)
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
  }, [effectiveFilters])

  return { results, isLoading, error }
}
