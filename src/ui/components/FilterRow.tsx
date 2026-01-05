import type { TimeRange } from "../../domain/types/filter"

type FilterRowProps = {
  domain: string | null
  timeRange: TimeRange
  limit: number
  // handlers later
}

function formatTimeRangeLabel(tr: TimeRange): string {
  if (tr.kind === "today") return "Today"
  if (tr.kind === "thisWeek") return "This week"
  return `Past ${tr.weeks} week${tr.weeks === 1 ? "" : "s"}`
}

export function FilterRow({ domain, timeRange, limit }: FilterRowProps) {
  const domainLabel = domain ?? "All sites"
  const timeLabel = formatTimeRangeLabel(timeRange)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        title="Domain filter (coming next)"
      >
        <span className="text-gray-500">Site</span>
        <span className="font-medium text-gray-900">{domainLabel}</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        title="Time range (coming next)"
      >
        <span className="text-gray-500">Range</span>
        <span className="font-medium text-gray-900">{timeLabel}</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        title="Limit (coming next)"
      >
        <span className="text-gray-500">Limit</span>
        <span className="font-medium text-gray-900">{limit}</span>
      </button>
    </div>
  )
}
