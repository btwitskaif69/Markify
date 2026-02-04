// Markify Extension - API Client
// Handles all communication with Markify backend

// Switch to production for release
const API_BASE = 'https://www.markify.tech/api';
// const API_BASE = 'http://localhost:3000/api';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'markify_token',
  USER: 'markify_user'
};

/**
 * Get stored auth token
 */
async function getToken() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.TOKEN);
  return result[STORAGE_KEYS.TOKEN] || null;
}

/**
 * Store auth token
 */
async function setToken(token) {
  await chrome.storage.local.set({ [STORAGE_KEYS.TOKEN]: token });
}

/**
 * Get stored user data
 */
async function getUser() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.USER);
  return result[STORAGE_KEYS.USER] || null;
}

/**
 * Store user data
 */
async function setUser(user) {
  await chrome.storage.local.set({ [STORAGE_KEYS.USER]: user });
}

/**
 * Clear all auth data (logout)
 */
async function clearAuth() {
  await chrome.storage.local.remove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
}

/**
 * Check if user is authenticated
 */
async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const text = await response.text();

    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid response from server');
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
}

/**
 * Login user
 */
async function login(email, password) {
  const data = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  await setToken(data.token);
  await setUser(data.user);

  return data;
}

/**
 * Get user's collections
 */
async function getCollections() {
  return await apiRequest('/collections');
}

/**
 * Extract metadata from URL
 */
async function extractMetadata(url) {
  return await apiRequest('/bookmarks/extract-metadata', {
    method: 'POST',
    body: JSON.stringify({ url })
  });
}

/**
 * Save a new bookmark
 */
async function saveBookmark(bookmark) {
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }

  // Add default category if not provided (required by Prisma schema)
  const bookmarkData = {
    ...bookmark,
    category: bookmark.category || 'Other'
  };

  return await apiRequest(`/users/${user.id}/bookmarks`, {
    method: 'POST',
    body: JSON.stringify(bookmarkData)
  });
}

// Export for use in other scripts
window.MarkifyAPI = {
  getToken,
  setToken,
  getUser,
  setUser,
  clearAuth,
  isAuthenticated,
  login,
  getCollections,
  extractMetadata,
  saveBookmark,
  STORAGE_KEYS
};
