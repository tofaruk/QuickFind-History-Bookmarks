import type { ResultItem } from "../../domain/types/result";

type ResultsListProps = {
  query: string;
  results: ResultItem[];
  isLoading?: boolean;
  error?: string | null;

  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;

  onOpenItem?: (item: ResultItem) => void;
  onRequestDeleteOne: (item: ResultItem) => void;
};

export function ResultsList({
  query,
  results,
  isLoading = false,
  error = null,
  selectedIds,
  onToggleSelected,
  onSelectAllVisible,
  onClearSelection,
  onOpenItem,
  onRequestDeleteOne,
}: ResultsListProps) {
  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const hasResults = results.length > 0;

  const allVisibleSelected =
    hasResults && results.every((r) => selectedIds.has(r.id));
  const someVisibleSelected =
    hasResults && results.some((r) => selectedIds.has(r.id));

  const subtitle = hasQuery
    ? `Searching for “${trimmed}”`
    : hasResults
    ? "Showing items for selected filters"
    : "Type to search, or select a site to browse";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">Results</div>
            <div className="text-xs text-gray-500 dark:text-gray-100">{subtitle}</div>
          </div>

          {hasResults && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  ref={(el) => {
                    if (el)
                      el.indeterminate =
                        !allVisibleSelected && someVisibleSelected;
                  }}
                  onChange={() => {
                    if (allVisibleSelected) onClearSelection();
                    else onSelectAllVisible();
                  }}
                />
                Select visible
              </label>
            </div>
          )}
        </div>
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
              {hasQuery
                ? "Try a different keyword."
                : "Or select a site to browse recent items."}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((r) => {
              const checked = selectedIds.has(r.id);
              return (
                <li key={r.id} className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => onToggleSelected(r.id)}
                      aria-label="Select item"
                    />

                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      onClick={() => onOpenItem?.(r)}
                      title={r.url}
                    >
                       <img
                        src={r.faviconUrl}
                        alt=""
                        className="mt-0.5 h-4 w-4 flex-none"
                      /> 
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {r.title}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {r.url}
                        </div>
                        {r.metaLine && (
                          <div className="truncate text-[11px] text-gray-400 dark:text-gray-200">
                            {r.metaLine}
                          </div>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-900 px-2 py-0.5 text-[10px] text-gray-600 dark:text-gray-200">
                        {r.kind}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRequestDeleteOne(r)}
                        className="rounded-lg px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        title={r.kind === "tab" ? "Close tab" : "Delete"}
                      >
                        {r.kind === "tab" ? "Close" : "Delete"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
