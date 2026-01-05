import type { ThemeMode } from "../../domain/types/theme"

const KEY = "themeMode"

export async function loadThemeMode(): Promise<ThemeMode> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return "system"

  return await new Promise((resolve) => {
    chrome.storage.local.get([KEY], (res) => {
      const v = res?.[KEY]
      if (v === "light" || v === "dark" || v === "system") resolve(v)
      else resolve("system")
    })
  })
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return

  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ [KEY]: mode }, () => resolve())
  })
}
