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
  const hasQuery = query.trim().length > 0

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="text-sm font-medium text-gray-900">Results</div>
        <div className="text-xs text-gray-500">
          {hasQuery ? `Searching for “${query.trim()}”` : "Type to start searching."}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {error ? (
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        ) : isLoading && results.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">Searching…</div>
        ) : !hasQuery ? (
          <div className="p-6 text-center">
            <div className="text-sm font-medium text-gray-900">
              Start typing to search
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Search across History and Bookmarks with filters.
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-sm font-medium text-gray-900">No results</div>
            <div className="mt-1 text-xs text-gray-500">
              Try a different keyword.
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
                  <img
                    src={r.faviconUrl}
                    alt=""
                    className="mt-0.5 h-4 w-4 flex-none"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {r.title}
                    </div>
                    <div className="truncate text-xs text-gray-500">{r.url}</div>
                    {r.metaLine && (
                      <div className="truncate text-[11px] text-gray-400">
                        {r.metaLine}
                      </div>
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
