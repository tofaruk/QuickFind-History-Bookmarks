export function isHistoryResultId(id: string): boolean {
  return id.startsWith("h:")
}

export function isBookmarkResultId(id: string): boolean {
  return id.startsWith("b:")
}

export function toBookmarkId(resultId: string): string | null {
  if (!isBookmarkResultId(resultId)) return null
  const raw = resultId.slice(2)
  return raw.length ? raw : null
}
