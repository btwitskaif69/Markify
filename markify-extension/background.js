// Markify Extension - Background Service Worker
// Handles context menu, keyboard shortcuts, and quick save

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
    // Regular save (opens popup)
    chrome.contextMenus.create({
        id: 'save-to-markify',
        title: 'Add to Markify',
        contexts: ['page', 'link']
    });

    // Quick save (instant save without popup)
    chrome.contextMenus.create({
        id: 'quick-save-to-markify',
        title: 'Quick Save to Markify ⚡',
        contexts: ['page', 'link']
    });

    // Separator
    chrome.contextMenus.create({
        id: 'markify-separator',
        type: 'separator',
        contexts: ['page', 'link']
    });

    // Save selection as note (for future enhancement)
    chrome.contextMenus.create({
        id: 'save-selection',
        title: 'Save Selection to Markify',
        contexts: ['selection']
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-to-markify') {
        // Regular save: open popup with pre-filled data
        const urlToSave = info.linkUrl || info.pageUrl;

        await chrome.storage.local.set({
            pending_save_url: urlToSave,
            pending_save_title: info.linkUrl ? '' : tab.title
        });

        chrome.action.openPopup();
    }

    if (info.menuItemId === 'quick-save-to-markify') {
        // Quick save: save immediately without popup
        const urlToSave = info.linkUrl || info.pageUrl;
        const title = info.linkUrl ? new URL(info.linkUrl).hostname : tab.title;

        await quickSave(urlToSave, title, tab.id);
    }

    if (info.menuItemId === 'save-selection') {
        // Save selected text as description
        const urlToSave = info.pageUrl;
        const selectedText = info.selectionText;

        await chrome.storage.local.set({
            pending_save_url: urlToSave,
            pending_save_title: tab.title,
            pending_description: selectedText
        });

        chrome.action.openPopup();
    }
});

// Quick save function - saves immediately without popup
async function quickSave(url, title, tabId) {
    try {
        // Get stored auth data
        const storage = await chrome.storage.local.get(['markify_token', 'markify_user']);
        const token = storage.markify_token;
        const user = storage.markify_user;

        if (!token || !user) {
            showNotification(tabId, 'Please log in first', 'error');
            chrome.action.openPopup(); // Open popup for login
            return;
        }

        // Set loading badge
        chrome.action.setBadgeText({ text: '...' });
        chrome.action.setBadgeBackgroundColor({ color: '#F59E0B' });

        // First extract metadata
        const API_BASE = 'https://www.markify.tech/api';

        let metadata = { title, description: '', image: null, tags: '' };

        try {
            const metaResponse = await fetch(`${API_BASE}/bookmarks/extract-metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url })
            });

            if (metaResponse.ok) {
                const metaData = await metaResponse.json();
                if (metaData.success && metaData.data) {
                    metadata = metaData.data;
                }
            }
        } catch (e) {
            // Continue with basic metadata
            console.log('Metadata extraction failed, using basic info');
        }

        // Save bookmark
        const response = await fetch(`${API_BASE}/users/${user.id}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: metadata.title || title,
                url: url,
                description: metadata.description || '',
                tags: metadata.tags || '',
                category: 'Other',
                previewImage: metadata.image || null,
                collectionId: null
            })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification(tabId, 'Bookmark saved! ✓', 'success');

            // Show success badge
            chrome.action.setBadgeText({ text: '✓' });
            chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
        } else if (response.status === 409) {
            showNotification(tabId, 'Already saved', 'warning');
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#F59E0B' });
        } else {
            throw new Error(result.message || 'Save failed');
        }

        // Clear badge after 2 seconds
        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 2000);

    } catch (error) {
        console.error('Quick save error:', error);
        showNotification(tabId, error.message || 'Save failed', 'error');

        chrome.action.setBadgeText({ text: '✗' });
        chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });

        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 2000);
    }
}

// Show notification in the page
async function showNotification(tabId, message, type = 'success') {
    try {
        await chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_NOTIFICATION',
            message,
            notificationType: type
        });
    } catch (e) {
        // Content script not loaded, inject it first
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content/content.js']
            });
            await chrome.scripting.insertCSS({
                target: { tabId },
                files: ['content/content.css']
            });

            // Retry sending message
            await chrome.tabs.sendMessage(tabId, {
                type: 'SHOW_NOTIFICATION',
                message,
                notificationType: type
            });
        } catch (err) {
            console.log('Could not show notification:', err);
        }
    }
}

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) return;

    if (command === 'save-bookmark') {
        // Regular save: open popup
        await chrome.storage.local.set({
            pending_save_url: tab.url,
            pending_save_title: tab.title
        });
        chrome.action.openPopup();
    }

    if (command === 'quick-save') {
        // Quick save: instant save
        await quickSave(tab.url, tab.title, tab.id);
    }

    if (command === 'toggle-floating-button') {
        // Toggle floating button visibility
        try {
            await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_FLOATING_BUTTON' });
        } catch (e) {
            // Inject content script first
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content/content.js']
            });
            await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ['content/content.css']
            });
            await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_FLOATING_BUTTON' });
        }
    }
});

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BOOKMARK_SAVED') {
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
        return true;
    }

    if (message.type === 'QUICK_SAVE_FROM_CONTENT') {
        quickSave(message.url, message.title, sender.tab.id);
    }
});
