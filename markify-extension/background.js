// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_BOOKMARKS') {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            const bookmarks = flattenBookmarks(bookmarkTreeNodes);
            sendResponse({ bookmarks });
        });
        return true; // Will respond asynchronously
    }
});

function flattenBookmarks(bookmarkTreeNodes) {
    let bookmarks = [];

    function traverse(nodes) {
        for (const node of nodes) {
            if (node.url) {
                bookmarks.push({
                    title: node.title,
                    url: node.url,
                    addDate: node.dateAdded ? new Date(node.dateAdded).toISOString() : null,
                    parentId: node.parentId
                });
            }
            if (node.children) {
                traverse(node.children);
            }
        }
    }

    traverse(bookmarkTreeNodes);
    return bookmarks;
}
