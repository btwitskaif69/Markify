// Markify Extension - Background Service Worker
// Handles context menu and keyboard shortcuts

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'save-to-markify',
        title: 'Add to Markify',
        contexts: ['page', 'link']
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-to-markify') {
        // Get the URL to save (prioritize link URL if right-clicked on a link)
        const urlToSave = info.linkUrl || info.pageUrl;

        // Store the URL temporarily and open popup
        await chrome.storage.local.set({
            pending_save_url: urlToSave,
            pending_save_title: info.linkUrl ? '' : tab.title // Use page title only for page saves
        });

        // Open the popup (user will see pre-filled form)
        chrome.action.openPopup();
    }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'save-bookmark') {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab) {
            // Store current page info and open popup
            await chrome.storage.local.set({
                pending_save_url: tab.url,
                pending_save_title: tab.title
            });

            chrome.action.openPopup();
        }
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BOOKMARK_SAVED') {
        // Show success badge briefly
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#10B981' });

        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 2000);
    }

    if (message.type === 'GET_CURRENT_TAB') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse(tabs[0]);
        });
        return true; // Keep channel open for async response
    }
});
