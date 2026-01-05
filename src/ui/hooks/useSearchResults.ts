import { useEffect, useMemo, useState } from "react"
import type { FilterState } from "../../domain/types/filter"
import type { ResultItem } from "../../domain/types/result"
import { searchHistory } from "../../services/chrome/historyService"
import { searchBookmarks } from "../../services/chrome/bookmarkService"
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

        if (effectiveFilters.scope === "bookmarks" || effectiveFilters.scope === "both") {
          parts.push(...(await searchBookmarks(effectiveFilters)))
        }

        // When scope is "both", we want a useful mixed order:
        // - history sorted by lastVisitTime already
        // - bookmarks sorted by title
        // We’ll do a simple merge strategy:
        //   - if both: prefer recent history first, then bookmarks
        // (Later we can interleave/rank)
        const merged =
          effectiveFilters.scope === "both"
            ? [
                ...parts.filter((p) => p.kind === "history"),
                ...parts.filter((p) => p.kind === "bookmark"),
              ]
            : parts

        if (!cancelled) setResults(merged)
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
