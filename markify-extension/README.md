# Markify Chrome Extension

Save any webpage to Markify with one click. Organize your bookmarks the modern way.

## Features

- 🔖 **One-Click Save** - Save the current page instantly
- 📁 **Collection Picker** - Organize into your collections
- 🏷️ **Auto-Fill** - Title, description, and tags extracted automatically
- ⌨️ **Keyboard Shortcut** - `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac)
- 🖱️ **Right-Click Menu** - "Add to Markify" context option
- 🌙 **Dark Mode** - Beautiful dark theme matching Markify

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select this `markify-extension` folder
5. The Markify icon will appear in your toolbar

## Usage

1. **First time**: Click the extension icon and log in with your Markify account
2. **Save a page**: Click the icon (or press `Ctrl+Shift+M`) on any webpage
3. **Edit details**: Modify the pre-filled title, description, or tags
4. **Choose collection**: Select from the dropdown or leave as "Unsorted"
5. **Click Save**: Your bookmark is saved to Markify!

## File Structure

```
markify-extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker (context menu, shortcuts)
├── popup/
│   ├── popup.html     # Popup UI
│   ├── popup.css      # Styles
│   └── popup.js       # Logic
├── utils/
│   └── api.js         # API client
└── icons/             # Extension icons
```

## Development

To test changes:
1. Make your edits
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Markify extension card
4. Changes will be applied immediately

## Keyboard Shortcuts

You can customize the keyboard shortcut:
1. Go to `chrome://extensions/shortcuts`
2. Find "Markify - Save Bookmarks"
3. Set your preferred key combination

## Troubleshooting

**Login not working?**
- Ensure you have an active Markify account at [markify.tech](https://www.markify.tech)
- Check your email and password

**Bookmark not saving?**
- Make sure you're logged in (click the icon to check)
- The page URL must be valid (not chrome:// pages)

**Extension icon not visible?**
- Click the puzzle piece icon in Chrome toolbar
- Pin the Markify extension

## License

MIT License - Part of the [Markify](https://github.com/btwitskaif69/Markify) project.
