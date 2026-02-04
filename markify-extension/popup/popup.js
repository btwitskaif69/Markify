// Markify Extension - Popup Logic
// Handles authentication and bookmark saving

// DOM Elements
const elements = {
    // Views
    loadingView: document.getElementById('loading-view'),
    loginView: document.getElementById('login-view'),
    saveView: document.getElementById('save-view'),
    successView: document.getElementById('success-view'),
    duplicateView: document.getElementById('duplicate-view'),

    // Login form
    loginForm: document.getElementById('login-form'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),

    // Save form
    saveForm: document.getElementById('save-form'),
    titleInput: document.getElementById('title'),
    urlInput: document.getElementById('url'),
    descriptionInput: document.getElementById('description'),
    tagsInput: document.getElementById('tags'),
    collectionSelect: document.getElementById('collection'),
    previewContainer: document.getElementById('preview-container'),
    previewImage: document.getElementById('preview-image'),
    saveBtn: document.getElementById('save-btn'),
    saveError: document.getElementById('save-error'),

    // Other buttons
    saveAnotherBtn: document.getElementById('save-another-btn'),
    closeDuplicateBtn: document.getElementById('close-duplicate-btn'),
    duplicateMessage: document.getElementById('duplicate-message')
};

// State
let currentPageData = {
    url: '',
    title: '',
    description: '',
    tags: '',
    image: null
};

// View management
function showView(viewName) {
    const views = ['loadingView', 'loginView', 'saveView', 'successView', 'duplicateView'];
    views.forEach(view => {
        elements[view].style.display = view === viewName ? 'block' : 'none';
    });

    // Show/hide logout button based on auth state
    elements.logoutBtn.style.display = viewName === 'saveView' ? 'block' : 'none';
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.style.display = 'none';
}

function setButtonLoading(button, loading) {
    const textSpan = button.querySelector('.btn-text');
    const loadingSpan = button.querySelector('.btn-loading');

    if (loading) {
        textSpan.style.display = 'none';
        loadingSpan.style.display = 'flex';
        button.disabled = true;
    } else {
        textSpan.style.display = 'inline';
        loadingSpan.style.display = 'none';
        button.disabled = false;
    }
}

// Initialize popup
async function init() {
    showView('loadingView');

    try {
        const isLoggedIn = await MarkifyAPI.isAuthenticated();

        if (isLoggedIn) {
            await loadSaveView();
        } else {
            showView('loginView');
        }
    } catch (error) {
        console.error('Init error:', error);
        showView('loginView');
    }
}

// Load save view with current page data
async function loadSaveView() {
    showView('loadingView');

    try {
        // Check for pending save from context menu or keyboard shortcut
        const storage = await chrome.storage.local.get(['pending_save_url', 'pending_save_title']);

        let pageUrl, pageTitle;

        if (storage.pending_save_url) {
            // Use pending save data
            pageUrl = storage.pending_save_url;
            pageTitle = storage.pending_save_title || '';

            // Clear pending data
            await chrome.storage.local.remove(['pending_save_url', 'pending_save_title']);
        } else {
            // Get current tab
            const tab = await new Promise(resolve => {
                chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' }, resolve);
            });

            if (!tab) {
                throw new Error('Could not get current tab');
            }

            pageUrl = tab.url;
            pageTitle = tab.title;
        }

        // Set initial values
        elements.urlInput.value = pageUrl;
        elements.titleInput.value = pageTitle;

        // Store current data
        currentPageData.url = pageUrl;
        currentPageData.title = pageTitle;

        // Load collections
        await loadCollections();

        // Show save view first (so user sees progress)
        showView('saveView');

        // Try to extract metadata (in background, don't block)
        extractAndFillMetadata(pageUrl);

    } catch (error) {
        console.error('Load save view error:', error);
        showError(elements.saveError, 'Failed to load page data');
        showView('saveView');
    }
}

// Extract metadata and fill form
async function extractAndFillMetadata(url) {
    try {
        const response = await MarkifyAPI.extractMetadata(url);

        if (response.success && response.data) {
            const { title, description, image, tags } = response.data;

            // Only update if fields are still empty or match initial values
            if (title && (!elements.titleInput.value || elements.titleInput.value === currentPageData.title)) {
                elements.titleInput.value = title;
            }

            if (description) {
                elements.descriptionInput.value = description;
            }

            if (tags) {
                elements.tagsInput.value = tags;
            }

            if (image) {
                elements.previewImage.src = image;
                elements.previewContainer.style.display = 'block';
                currentPageData.image = image;
            }
        }
    } catch (error) {
        // Silently fail - user can still save with basic information
        console.log('Metadata extraction failed:', error);
    }
}

// Load user's collections
async function loadCollections() {
    try {
        const collections = await MarkifyAPI.getCollections();

        // Clear existing options (except default)
        elements.collectionSelect.innerHTML = '<option value="">Unsorted</option>';

        // Add collections
        collections.forEach(collection => {
            const option = document.createElement('option');
            option.value = collection.id;
            option.textContent = collection.name;
            elements.collectionSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load collections:', error);
        // Non-critical - user can still save to Unsorted
    }
}

// Login handler
async function handleLogin(e) {
    e.preventDefault();

    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;

    if (!email || !password) {
        showError(elements.loginError, 'Please fill in all fields');
        return;
    }

    hideError(elements.loginError);
    setButtonLoading(elements.loginBtn, true);

    try {
        await MarkifyAPI.login(email, password);
        await loadSaveView();
    } catch (error) {
        showError(elements.loginError, error.message || 'Login failed');
    } finally {
        setButtonLoading(elements.loginBtn, false);
    }
}

// Save bookmark handler
async function handleSave(e) {
    e.preventDefault();

    const title = elements.titleInput.value.trim();
    const url = elements.urlInput.value.trim();
    const description = elements.descriptionInput.value.trim();
    const tags = elements.tagsInput.value.trim();
    const collectionId = elements.collectionSelect.value || null;

    if (!title || !url) {
        showError(elements.saveError, 'Title and URL are required');
        return;
    }

    hideError(elements.saveError);
    setButtonLoading(elements.saveBtn, true);

    try {
        const bookmarkData = {
            title,
            url,
            description: description || null,
            tags: tags || null,
            collectionId,
            previewImage: currentPageData.image || null
        };

        await MarkifyAPI.saveBookmark(bookmarkData);

        // Notify background script
        chrome.runtime.sendMessage({ type: 'BOOKMARK_SAVED' });

        // Show success
        showView('successView');

    } catch (error) {
        // Handle duplicate
        if (error.message.includes('already exists')) {
            elements.duplicateMessage.textContent = error.message;
            showView('duplicateView');
        } else {
            showError(elements.saveError, error.message || 'Failed to save bookmark');
        }
    } finally {
        setButtonLoading(elements.saveBtn, false);
    }
}

// Logout handler
async function handleLogout() {
    await MarkifyAPI.clearAuth();
    showView('loginView');

    // Clear form
    elements.emailInput.value = '';
    elements.passwordInput.value = '';
    hideError(elements.loginError);
}

// Save another handler
function handleSaveAnother() {
    // Reset form
    elements.descriptionInput.value = '';
    elements.tagsInput.value = '';
    elements.collectionSelect.value = '';
    elements.previewContainer.style.display = 'none';
    hideError(elements.saveError);

    // Reload save view
    loadSaveView();
}

// Close duplicate handler
function handleCloseDuplicate() {
    showView('saveView');
}

// Event listeners
elements.loginForm.addEventListener('submit', handleLogin);
elements.saveForm.addEventListener('submit', handleSave);
elements.logoutBtn.addEventListener('click', handleLogout);
elements.saveAnotherBtn.addEventListener('click', handleSaveAnother);
elements.closeDuplicateBtn.addEventListener('click', handleCloseDuplicate);

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
