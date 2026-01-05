import type { ResultItem } from "../../domain/types/result"

type ResultsListProps = {
  query: string
  results: ResultItem[]
  isLoading?: boolean
  error?: string | null
  onOpenUrl?: (url: string) => void
}

export function ResultsList({
  query,
  results,
  isLoading = false,
  error = null,
  onOpenUrl,
}: ResultsListProps) {
  const trimmed = query.trim()
  const hasQuery = trimmed.length > 0
  const hasResults = results.length > 0

  const subtitle = hasQuery
    ? `Searching for “${trimmed}”`
    : hasResults
      ? "Showing recent items for selected site"
      : "Type to search, or select a site to browse"

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="text-sm font-medium text-gray-900">Results</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : isLoading && !hasResults ? (
          <div className="p-4 text-sm text-gray-600">Searching…</div>
        ) : !hasResults ? (
          <div className="p-6 text-center">
            <div className="text-sm font-medium text-gray-900">
              {hasQuery ? "No results" : "Start typing to search"}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {hasQuery ? "Try a different keyword." : "Or select a site to browse recent items."}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((r) => (
              <li key={r.id} className="px-3 py-2 hover:bg-gray-50">
                <button
                  type="button"
                  className="flex w-full items-start gap-3 text-left"
                  onClick={() => onOpenUrl?.(r.url)}
                  title={r.url}
                >
                  <img src={r.faviconUrl} alt="" className="mt-0.5 h-4 w-4 flex-none" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {r.title}
                    </div>
                    <div className="truncate text-xs text-gray-500">{r.url}</div>
                    {r.metaLine && (
                      <div className="truncate text-[11px] text-gray-400">{r.metaLine}</div>
                    )}
                  </div>
                  <div className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                    {r.kind}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
