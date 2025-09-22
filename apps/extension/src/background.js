/**
 * Background Service Worker
 *
 * Purpose: Handles extension icon clicks and manages navigation to options page
 *
 * SRS Reference:
 * - Extension UX improvements
 */

/* global chrome */

// Track side panel state per tab
const sidePanelStates = new Map();

// Open options page when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Allow side panel to be opened programmatically and handle settings updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidePanel') {
    // Toggle the side panel from content script
    if (sender.tab) {
      const tabId = sender.tab.id;
      const isCurrentlyOpen = sidePanelStates.get(tabId) || false;

      if (!isCurrentlyOpen) {
        // Open the side panel
        chrome.sidePanel
          .open({ windowId: sender.tab.windowId })
          .then(() => {
            sidePanelStates.set(tabId, true);
            sendResponse({ success: true, isOpen: true });
          })
          .catch((err) => {
            console.error('Failed to open side panel:', err);
            sendResponse({ success: false, error: err.message });
          });
      } else {
        // Close the side panel - Chrome doesn't have a direct close API, so we disable and re-enable
        chrome.sidePanel
          .setOptions({
            tabId: tabId,
            enabled: false,
          })
          .then(() => {
            // Re-enable it immediately so it can be opened again
            return chrome.sidePanel.setOptions({
              tabId: tabId,
              enabled: true,
              path: 'sidepanel.html',
            });
          })
          .then(() => {
            sidePanelStates.set(tabId, false);
            sendResponse({ success: true, isOpen: false });
          })
          .catch((err) => {
            console.error('Failed to close side panel:', err);
            // If closing fails, try alternative approach
            sidePanelStates.set(tabId, false);
            sendResponse({ success: true, isOpen: false });
          });
      }
    }
    return true; // Keep message channel open for async response
  } else if (request.action === 'openSidePanel') {
    // Get the current window ID - works from both tabs and extension pages
    chrome.windows.getCurrent((window) => {
      chrome.sidePanel
        .open({ windowId: window.id })
        .then(() => sendResponse({ success: true }))
        .catch((err) => {
          console.error('Failed to open side panel:', err);
          // Try without window ID as fallback
          chrome.sidePanel
            .open()
            .then(() => sendResponse({ success: true }))
            .catch((fallbackErr) => sendResponse({ success: false, error: fallbackErr.message }));
        });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'triggerSettingsUpdate') {
    // Relay settings update to all extension pages (including side panel)
    console.log('[Background] Relaying settings update', request.data);

    // Send to all tabs and extension pages
    chrome.runtime
      .sendMessage({
        action: 'triggerSettingsUpdate',
        data: request.data,
      })
      .catch(() => {
        // Ignore errors - side panel might not be open
      });

    sendResponse({ success: true });
    return true;
  }
});

// Clean up state when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  sidePanelStates.delete(tabId);
});

// Reset state when side panel is closed by user
// Note: Chrome doesn't have a direct API for this, so we track via focus changes
chrome.windows.onFocusChanged.addListener(() => {
  // When focus changes, assume panels might have been closed
  // This is a workaround since Chrome doesn't have a panel close event
  sidePanelStates.clear();
});
