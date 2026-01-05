import type { FilterState } from "../types/filter"

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  scope: "both",
  domain: null,
  timeRange: { kind: "today" },
  limit: 50,
}
