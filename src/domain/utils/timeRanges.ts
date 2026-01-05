import type { TimeRange } from "../types/filter"

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/**
 * Europe expectation: week starts Monday.
 */
function startOfWeekMonday(d: Date): Date {
  const x = startOfDay(d)
  const day = x.getDay() // 0=Sun,1=Mon...
  const diff = (day === 0 ? -6 : 1 - day) // move back to Monday
  x.setDate(x.getDate() + diff)
  return x
}

export function toHistoryTimeWindow(range: TimeRange, now = new Date()): {
  startTime: number
  endTime: number
} {
  const end = now.getTime()

  if (range.kind === "today") {
    return { startTime: startOfDay(now).getTime(), endTime: end }
  }

  if (range.kind === "thisWeek") {
    return { startTime: startOfWeekMonday(now).getTime(), endTime: end }
  }

  // pastWeeks
  const start = startOfWeekMonday(now)
  start.setDate(start.getDate() - 7 * (range.weeks - 1))
  return { startTime: start.getTime(), endTime: end }
}
