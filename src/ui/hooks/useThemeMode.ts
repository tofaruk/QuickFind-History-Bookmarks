import { useEffect, useMemo, useState } from "react"
import type { ThemeMode } from "../../domain/types/theme"
import { loadThemeMode, saveThemeMode } from "../../services/chrome/themeStorage"

function systemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("system")

  // load once
  useEffect(() => {
    loadThemeMode().then(setMode).catch(() => setMode("system"))
  }, [])

  const effective = useMemo<"light" | "dark">(() => {
    if (mode === "system") return systemPrefersDark() ? "dark" : "light"
    return mode
  }, [mode])

  // apply to document
/*   useEffect(() => {
    const root = document.documentElement
    if (effective === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [effective]) */

  useEffect(() => {
  const root = document.documentElement
  root.classList.toggle("dark", effective === "dark")
}, [effective])

  // persist when user changes
  async function updateMode(next: ThemeMode) {
    setMode(next)
    await saveThemeMode(next)
  }

  return { mode, effective, setMode: updateMode }
}
