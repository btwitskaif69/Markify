// Markify Extension - Content Script
// Handles floating button and notifications

let floatingButtonVisible = false;
let floatingButton = null;
let notification = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SHOW_NOTIFICATION') {
        showNotification(message.message, message.notificationType);
    }

    if (message.type === 'TOGGLE_FLOATING_BUTTON') {
        toggleFloatingButton();
    }
});

// Show notification toast
function showNotification(message, type = 'success') {
    // Remove existing notification
    if (notification) {
        notification.remove();
    }

    notification = document.createElement('div');
    notification.className = `markify-notification markify-notification--${type}`;
    notification.innerHTML = `
        <div class="markify-notification__icon">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : '!'}
        </div>
        <div class="markify-notification__message">${message}</div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('markify-notification--visible');
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification) {
            notification.classList.remove('markify-notification--visible');
            setTimeout(() => {
                if (notification) {
                    notification.remove();
                    notification = null;
                }
            }, 300);
        }
    }, 3000);
}

// Toggle floating button
function toggleFloatingButton() {
    if (floatingButtonVisible) {
        hideFloatingButton();
    } else {
        showFloatingButton();
    }
}

// Show floating button
function showFloatingButton() {
    if (floatingButton) return;

    floatingButton = document.createElement('div');
    floatingButton.className = 'markify-floating-button';
    floatingButton.innerHTML = `
        <div class="markify-floating-button__main" title="Quick Save to Markify">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>
        <div class="markify-floating-button__menu">
            <button class="markify-floating-button__option" data-action="quick-save" title="Quick Save">
                <span>⚡</span> Quick Save
            </button>
            <button class="markify-floating-button__option" data-action="save-with-options" title="Save with Options">
                <span>📝</span> Save with Options
            </button>
        </div>
    `;

    // Event listeners
    const mainBtn = floatingButton.querySelector('.markify-floating-button__main');
    const menu = floatingButton.querySelector('.markify-floating-button__menu');

    // Toggle menu on click
    mainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingButton.classList.toggle('markify-floating-button--expanded');
    });

    // Handle option clicks
    floatingButton.querySelectorAll('.markify-floating-button__option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;

            if (action === 'quick-save') {
                chrome.runtime.sendMessage({
                    type: 'QUICK_SAVE_FROM_CONTENT',
                    url: window.location.href,
                    title: document.title
                });
            } else if (action === 'save-with-options') {
                chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' });
                // This will trigger popup to open
            }

            floatingButton.classList.remove('markify-floating-button--expanded');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        floatingButton?.classList.remove('markify-floating-button--expanded');
    });

    // Make draggable
    makeDraggable(floatingButton, mainBtn);

    document.body.appendChild(floatingButton);
    floatingButtonVisible = true;

    // Animate in
    requestAnimationFrame(() => {
        floatingButton.classList.add('markify-floating-button--visible');
    });
}

// Hide floating button
function hideFloatingButton() {
    if (!floatingButton) return;

    floatingButton.classList.remove('markify-floating-button--visible');
    setTimeout(() => {
        floatingButton?.remove();
        floatingButton = null;
        floatingButtonVisible = false;
    }, 300);
}

// Make element draggable
function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    handle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = element.getBoundingClientRect();
        initialX = rect.right;
        initialY = rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newRight = window.innerWidth - (initialX + deltaX);
        const newTop = initialY + deltaY;

        // Keep within viewport
        const boundedRight = Math.max(10, Math.min(window.innerWidth - 70, newRight));
        const boundedTop = Math.max(10, Math.min(window.innerHeight - 70, newTop));

        element.style.right = `${boundedRight}px`;
        element.style.top = `${boundedTop}px`;
        element.style.bottom = 'auto';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// Auto-show floating button if enabled in settings (optional enhancement)
// For now, button is toggled via keyboard shortcut or can be enabled by default
