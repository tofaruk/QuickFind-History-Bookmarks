export async function openUrl(url: string): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.tabs?.create) {
    throw new Error("chrome.tabs API is not available.")
  }

  await new Promise<void>((resolve, reject) => {
    chrome.tabs.create({ url }, () => {
      const err = chrome.runtime?.lastError
      if (err) reject(new Error(err.message))
      else resolve()
    })
  })
}
