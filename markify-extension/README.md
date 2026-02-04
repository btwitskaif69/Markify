# Markify Chrome Extension

Save any webpage to Markify with one click. Multiple quick-save options for power users.

## Installation

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `markify-extension` folder

## Features

### 🖱️ Save Methods

| Method | How to Use | Speed |
|--------|------------|-------|
| **Quick Save ⚡** | Right-click → "Quick Save to Markify ⚡" | Instant |
| **Save with Options** | Right-click → "Add to Markify" | Opens popup |
| **Save Selection** | Select text → right-click → "Save Selection to Markify" | Popup with text as description |
| **Floating Button** | Press `Ctrl+Shift+B` to toggle | On-page button |

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+Shift+M` | Open save popup |
| `Alt+Shift+S` | Quick save (instant) |
| `Alt+Shift+F` | Toggle floating button |

### ✨ Other Features

- Auto-extract title, description, and tags
- Preview image extraction
- Collection selection
- Duplicate detection
- Dark theme UI

## Files

```
markify-extension/
├── manifest.json        # Extension config (v1.1.0)
├── background.js        # Service worker
├── popup/               # Popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/             # Page-injected scripts
│   ├── content.js       # Floating button + notifications
│   └── content.css
├── utils/
│   └── api.js           # API client
└── icons/               # Extension icons
```

## Development

Switch to localhost for testing:

```javascript
// In utils/api.js, change:
const API_BASE = 'http://localhost:3000/api';
```

## Requirements

- Chrome 88+ (Manifest V3 support)
- Logged-in Markify account
