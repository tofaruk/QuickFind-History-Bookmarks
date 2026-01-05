import { useEffect, useMemo, useState } from "react"
import type { DomainOption } from "../../services/chrome/domainService"
import { faviconUrlFor } from "../../domain/utils/url"

type DomainSelectProps = {
  value: string | null
  options: DomainOption[]
  onChange: (hostname: string | null) => void
}

export function DomainSelect({ value, options, onChange }: DomainSelectProps) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return options
    return options.filter((o) => o.hostname.toLowerCase().includes(needle))
  }, [options, q])

  useEffect(() => {
    if (!open) setQ("")
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        onClick={() => setOpen((v) => !v)}
        title="Domain filter"
      >
        <span className="truncate">
          <span className="text-gray-500">Site </span>
          <span className="font-medium text-gray-900">{value ?? "All sites"}</span>
        </span>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter sites…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-300"
            />
          </div>

          <div className="max-h-60 overflow-auto p-2 pt-0">
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              className={[
                "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-gray-50",
                value === null ? "bg-gray-50" : "",
              ].join(" ")}
            >
              <div className="h-4 w-4 rounded bg-gray-100" />
              <div className="min-w-0 flex-1 truncate">
                <div className="font-medium text-gray-900">All sites</div>
                <div className="text-xs text-gray-500">No domain filter</div>
              </div>
            </button>

            <div className="my-2 h-px bg-gray-100" />

            {filtered.map((o) => {
              const active = value === o.hostname
              return (
                <button
                  key={o.hostname}
                  type="button"
                  onClick={() => {
                    onChange(o.hostname)
                    setOpen(false)
                  }}
                  className={[
                    "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-gray-50",
                    active ? "bg-gray-50" : "",
                  ].join(" ")}
                >
                  <img
                    src={faviconUrlFor(`https://${o.hostname}`, 16)}
                    className="h-4 w-4"
                    alt=""
                  />
                  <div className="min-w-0 flex-1 truncate">
                    <div className="font-medium text-gray-900">{o.hostname}</div>
                    <div className="text-xs text-gray-500">{o.count} visits</div>
                  </div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div className="px-2 py-3 text-sm text-gray-500">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
