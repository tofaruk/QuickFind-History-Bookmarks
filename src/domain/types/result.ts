export type ResultKind = "history" | "bookmark" | "tab"

export type ResultItem = {
  id: string
  kind: ResultKind
  title: string
  url: string
  hostname: string
  faviconUrl?: string
  metaLine?: string
  lastVisitTime?: number

  // For open tabs:
  tabId?: number
  windowId?: number
}
