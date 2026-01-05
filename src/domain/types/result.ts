export type ResultKind = "history" | "bookmark"

export type ResultItem = {
  id: string
  kind: ResultKind
  title: string
  url: string
  hostname: string
  faviconUrl?: string
  metaLine?: string // e.g. "Last visit: …" or "Folder: …"
  lastVisitTime?: number // for history sorting/display
}
