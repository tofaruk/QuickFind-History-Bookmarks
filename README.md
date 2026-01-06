# QuickFind: History, Bookmarks & Open Tabs

🚀 **QuickFind** is a fast, lightweight Chrome extension that lets you instantly search and manage your **browsing history, bookmarks, and open tabs** from a single popup.

Built with **React, TypeScript, Tailwind CSS, and Vite**, QuickFind focuses on speed, clarity, and productivity.

---

## ✨ Features

### 🔍 Unified Search
- Search **Browsing History**
- Search **Bookmarks**
- Search **Open Tabs**
- **All mode** to search everything together

### 🧭 Instant Tab Navigation
- Jump directly to an already open tab
- Works across **multiple Chrome windows**

### 🗑️ Smart Management
- Delete history entries
- Remove bookmarks
- Close open tabs
- Bulk actions:
  - Remove **selected** items
  - Remove **visible** results

### 🌐 Filters & Controls
- Filter results by **top visited domains**
- Filter by **time range**:
  - Today
  - Last 7 days
  - Last 30 days
  - All time
- Adjustable **result limits** (25 / 50 / 100)

### 🌗 Light & Dark Mode
- Manual theme switcher
- System theme support
- Theme preference is remembered

### ⚡ Fast & Privacy-Friendly
- No background polling
- No analytics
- No external servers
- All operations run **locally inside your browser**

---

## 🖼️ Demo

![QuickFind Demo](./screenshots/demo.gif)

---

## 🧩 How to Use (Users)

1. Click the **QuickFind** extension icon
2. Choose a scope:
   - History
   - Bookmarks
   - Open Tabs
   - All
3. Start typing to search
4. Click a result:
   - History / Bookmark → opens page
   - Open Tab → jumps to the existing tab
5. Use filters to narrow results
6. Select items to:
   - Delete history
   - Remove bookmarks
   - Close tabs

---

## 🛠️ Tech Stack

- **React** – UI
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Vite** – Build tooling
- **Chrome Extension Manifest V3**

---

## 📦 Installation (Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/quickfind-history-bookmarks-tabs.git
cd quickfind-history-bookmarks-tabs
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Build the extension
```bash
npm run build
```

### 4️⃣ Load into Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` directory

---

## 🚀 Development Workflow

```bash
npm run dev
```

- Vite builds the UI
- Reload the extension from `chrome://extensions`
- Reopen the popup to see changes

---

## 🧠 Project Structure (For Developers)

```
src/
├── domain/          # Types, filters, utilities
├── services/        # Chrome API wrappers (history, bookmarks, tabs)
├── ui/
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   └── layout/      # Popup layout
├── popup/           # Popup entry point
└── styles/          # Global styles
```

### Key Design Principles
- **No direct Chrome API usage in UI**
- Services abstract Chrome APIs
- UI stays pure and testable
- Strong typing across layers

---

## 🧩 How to Extend (Developers)

### Add a new filter
1. Update `FilterState` in `domain/types`
2. Update UI in `FilterRow`
3. Apply logic in `useSearchResults`

### Add a new data source
1. Create a service in `services/chrome/`
2. Map results to `ResultItem`
3. Include it in `useSearchResults`

### Add UI features
- UI components live in `ui/components`
- Shared state lives in `PopupShell`
- Keep logic in hooks where possible

---

## 🔐 Permissions Explained

| Permission | Purpose |
|---------|--------|
| `history` | Search and delete browsing history |
| `bookmarks` | Search and manage bookmarks |
| `tabs` | List, focus, and close open tabs |
| `favicon` | Display website favicons |

🔒 **No user data is collected or transmitted.**  
Everything runs locally.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please follow existing patterns and keep code readable.

---

## 📄 License

MIT License

You are free to use, modify, and distribute this project.

---

## ⭐ Support

If you find this project useful:
- ⭐ Star the repository
- 🐛 Report issues
- 💡 Suggest features

Your feedback helps improve QuickFind!
