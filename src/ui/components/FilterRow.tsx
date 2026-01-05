import type { TimeRange } from "../../domain/types/filter"
import type { DomainOption } from "../../services/chrome/domainService"
import { DomainSelect } from "./DomainSelect"

type FilterRowProps = {
  domain: string | null
  timeRange: TimeRange
  limit: number

  domainOptions: DomainOption[]
  onDomainChange: (hostname: string | null) => void

  // placeholders for next steps
  onTimeClick?: () => void
  onLimitClick?: () => void
}

function formatTimeRangeLabel(tr: TimeRange): string {
  if (tr.kind === "today") return "Today"
  if (tr.kind === "thisWeek") return "This week"
  return `Past ${tr.weeks} week${tr.weeks === 1 ? "" : "s"}`
}

export function FilterRow({
  domain,
  timeRange,
  limit,
  domainOptions,
  onDomainChange,
  onTimeClick,
  onLimitClick,
}: FilterRowProps) {
  const timeLabel = formatTimeRangeLabel(timeRange)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-[180px]">
        <DomainSelect value={domain} options={domainOptions} onChange={onDomainChange} />
      </div>

      <button
        type="button"
        onClick={onTimeClick}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        title="Time range (next step)"
      >
        <span className="text-gray-500">Range</span>
        <span className="font-medium text-gray-900">{timeLabel}</span>
      </button>

      <button
        type="button"
        onClick={onLimitClick}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        title="Limit (next step)"
      >
        <span className="text-gray-500">Limit</span>
        <span className="font-medium text-gray-900">{limit}</span>
      </button>
    </div>
  )
}
