import type { FilterState } from "../types/filter"

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  scope: "open",
  domain: null,
  timeRange: { kind: "today" },
  limit: 50,
}
