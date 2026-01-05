export type Scope = "history" | "bookmarks" | "open" | "all"

export type TimeRange =
  | { kind: "today" }
  | { kind: "thisWeek" }
  | { kind: "pastWeeks"; weeks: number }

export type FilterState = {
  query: string
  scope: Scope
  domain: string | null // hostname like "github.com" or null = all
  timeRange: TimeRange
  limit: number
}
