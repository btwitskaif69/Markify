// Listen for messages from the React App
window.addEventListener('message', (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) return;

    if (event.data.type && event.data.type === 'MARKIFY_GET_BOOKMARKS') {
        // Ask background script for bookmarks
        chrome.runtime.sendMessage({ type: 'GET_BOOKMARKS' }, (response) => {
            if (response && response.bookmarks) {
                // Send bookmarks back to React App
                window.postMessage({
                    type: 'MARKIFY_BOOKMARKS_RESPONSE',
                    bookmarks: response.bookmarks
                }, '*');
            }
        });
    }
});

// Notify React App that extension is installed
// We can do this by setting a global variable or sending a message
// But since the content script runs after page load, we might need to send a message
setTimeout(() => {
    window.postMessage({ type: 'MARKIFY_EXTENSION_INSTALLED' }, '*');
}, 500);
