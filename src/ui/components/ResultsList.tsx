type ResultsListProps = {
  query: string
  isLoading?: boolean
}

export function ResultsList({ query, isLoading = false }: ResultsListProps) {
  const hasQuery = query.trim().length > 0

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="text-sm font-medium text-gray-900">Results</div>
        <div className="text-xs text-gray-500">
          {hasQuery ? `Searching for “${query.trim()}”` : "Type to start searching."}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10 text-center">
        {isLoading ? (
          <div className="text-sm text-gray-600">Searching…</div>
        ) : hasQuery ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              No results yet (not wired)
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Next step: connect History + Bookmarks services.
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-medium text-gray-900">
              Start typing to search
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Search across History and Bookmarks with filters.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
