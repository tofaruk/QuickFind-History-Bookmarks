type Scope = "history" | "bookmarks" | "open" | "all"

type ScopeTabsProps = {
  value?: Scope
  onChange?: (value: Scope) => void
}

const TABS: Array<{ key: Scope; label: string }> = [
  { key: "open", label: "Open Tabs" },
  { key: "history", label: "History" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "all", label: "All" },
]

export function ScopeTabs({ value = "all", onChange }: ScopeTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex rounded-xl bg-gray-100 p-1">
        {TABS.map((t) => {
          const active = value === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange?.(t.key)}
              className={[
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                active ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="text-xs text-gray-500">
        {value === "history" && "Searching browsing history"}
        {value === "bookmarks" && "Searching bookmarks"}
        {value === "open" && "Searching open tabs"}
        {value === "all" && "Searching everything"}
      </div>
    </div>
  )
}
