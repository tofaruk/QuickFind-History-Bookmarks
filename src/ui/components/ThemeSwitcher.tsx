import type { ThemeMode } from "../../domain/types/theme"

type Props = {
  value: ThemeMode
  onChange: (mode: ThemeMode) => void
}

const OPTIONS: Array<{ key: ThemeMode; label: string }> = [
  { key: "system", label: "System" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
]

export function ThemeSwitcher({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
      {OPTIONS.map((o) => {
        const active = value === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={[
              "rounded-lg px-2.5 py-1 text-xs font-medium transition",
              active
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
            ].join(" ")}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
