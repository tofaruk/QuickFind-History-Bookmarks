import type { TimeRange } from "../../domain/types/filter"
import type { DomainOption } from "../../services/chrome/domainService"
import { DomainSelect } from "./DomainSelect"
import { TimeRangeSelect } from "./TimeRangeSelect"
import { LimitSelect } from "./LimitSelect"

type FilterRowProps = {
  domain: string | null
  timeRange: TimeRange
  limit: number
  scope: string | null

  domainOptions: DomainOption[]
  onDomainChange: (hostname: string | null) => void
  onTimeRangeChange: (tr: TimeRange) => void
  onLimitChange: (limit: number) => void
}

export function FilterRow({
  domain,
  timeRange,
  limit,
  scope,
  domainOptions,
  onDomainChange,
  onTimeRangeChange,
  onLimitChange,
}: FilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-45">
        <DomainSelect value={domain} options={domainOptions} onChange={onDomainChange} />
      </div>

      <div className="w-40">
        <TimeRangeSelect value={timeRange} currentScope={scope} onChange={onTimeRangeChange} />
      </div>

      <div className="w-30">
        <LimitSelect value={limit} onChange={onLimitChange} />
      </div>
    </div>
  )
}
