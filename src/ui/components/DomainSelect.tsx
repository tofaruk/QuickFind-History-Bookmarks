import { useEffect, useMemo, useRef, useState } from "react"
import type { DomainOption } from "../../services/chrome/domainService"
import { faviconUrlFor } from "../../domain/utils/url"

type DomainSelectProps = {
  value: string | null
  options: DomainOption[]
  disabled?: boolean
  onChange: (hostname: string | null) => void
}

function useClickOutside(
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const inside = refs.some((r) => r.current && r.current.contains(target))
      if (!inside) onOutside()
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [refs, onOutside, enabled])
}


export function DomainSelect({ value, options, disabled, onChange }: DomainSelectProps) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useClickOutside([buttonRef, panelRef], () => setOpen(false), open)

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
        ref={buttonRef}
        type="button"
        disabled={disabled}
        className={[
          "inline-flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-whit dark:bg-gray-800 px-3 py-2 text-sm shadow-sm dark:hover:bg-gray-900",
          disabled ? "opacity-60" : "hover:bg-gray-50",
        ].join(" ")}
        onClick={() => setOpen((v) => !v)}
        title="Domain filter"
      >
        <span className="min-w-0 truncate">
          <span className="text-gray-500 dark:text-gray-200 dark:hover:text-gray-300">Site </span>
          <span className="font-medium text-gray-900  dark:text-gray-50 dark:hover:text-white">{value ?? "All sites"}</span>
        </span>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && !disabled && (
        <div
          ref={panelRef}
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 shadow-lg"
        >
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
                "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-950",
                value === null ? "bg-gray-50 dark:bg-gray-900" : "",
              ].join(" ")}
            >
              <div className="h-4 w-4 rounded bg-gray-100 dark:bg-gray-900" />
              <div className="min-w-0 flex-1 truncate">
                <div className="font-medium text-gray-900 dark:text-gray-50">All sites</div>
                <div className="text-xs text-gray-500 dark:text-gray-50">No domain filter</div>
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
                    "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-900",
                    active ? "bg-gray-50 dark:bg-gray-900" : "",
                  ].join(" ")}
                >
                  <img
                    src={faviconUrlFor(`https://${o.hostname}`, 16)}
                    className="h-4 w-4"
                    alt=""
                  />
                  <div className="min-w-0 flex-1 truncate">
                    <div className="font-medium text-gray-900 dark:text-gray-50">{o.hostname}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-100">{o.count} visits</div>
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
