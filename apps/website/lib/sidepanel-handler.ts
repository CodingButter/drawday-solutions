/**
 * Sidepanel Handler
 * 
 * Handles opening the spinner panel either:
 * 1. In Chrome extension - uses chrome.sidePanel API
 * 2. In standalone website - opens popup window
 */

declare global {
  interface Window {
    openSidepanel?: () => void;
  }
}

export function openSpinnerPanel() {
  // Check if we're in an extension context (openSidepanel function passed from extension)
  if (typeof window !== 'undefined' && window.openSidepanel) {
    // We're in the extension iframe - use the passed function
    console.log('Using injected openSidepanel function');
    window.openSidepanel();
  } else if (window.parent !== window) {
    // We're in an iframe but function not injected - use postMessage
    console.log('Using postMessage to request side panel opening');
    window.parent.postMessage({ action: 'openSidePanel' }, '*');
  } else {
    // We're on the standalone website - open a popup window
    console.log('Opening popup window for spinner');
    const width = 400;
    const height = 600;
    const left = window.screen.width - width - 50;
    const top = 50;
    
    window.open(
      '/live-spinner/spinner',
      'DrawDaySpinner',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  }
}