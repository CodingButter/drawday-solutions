import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

// For development, always use localhost
// Change this to 'https://www.drawday.app' for production builds
const WEBSITE_URL = 'http://localhost:3000';

console.log('DrawDay Options URL:', WEBSITE_URL);

function OptionsIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Function to open the side panel
    const openSidePanel = async () => {
      try {
        // Use chrome.runtime.sendMessage to communicate with background script
        const response = await chrome.runtime.sendMessage({ action: 'openSidePanel' });
        if (!response?.success) {
          console.error('Failed to open side panel:', response?.error);
        }
      } catch (error) {
        console.error('Failed to open side panel:', error);
      }
    };

    // Function to trigger settings update in side panel
    const triggerSettingsUpdate = async (data?: unknown) => {
      try {
        console.log('[Extension] Triggering settings update in side panel', data);
        // Send message to background script to notify side panel
        await chrome.runtime.sendMessage({
          action: 'triggerSettingsUpdate',
          data: data
        });
      } catch (error) {
        console.error('Failed to trigger settings update:', error);
      }
    };

    // Wait for iframe to load and inject the functions
    const handleIframeLoad = () => {
      console.log('Iframe loaded, attempting to inject functions');
      if (iframeRef.current?.contentWindow) {
        try {
          // Inject both functions into the iframe's window
          const iframeWindow = iframeRef.current.contentWindow as Window & {
            openSidepanel?: typeof openSidePanel;
            triggerSettingsUpdate?: typeof triggerSettingsUpdate;
          };
          iframeWindow.openSidepanel = openSidePanel;
          iframeWindow.triggerSettingsUpdate = triggerSettingsUpdate;
          console.log('Successfully injected openSidepanel and triggerSettingsUpdate functions');
        } catch (error) {
          console.error('Failed to inject functions, will use postMessage fallback:', error);
        }
      }
    };

    // Add load listener if iframe exists
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
      // Try to inject immediately in case iframe is already loaded
      handleIframeLoad();
    }

    // Also listen for messages as a fallback
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== WEBSITE_URL) return;

      if (event.data?.action === 'openSidePanel') {
        await openSidePanel();
      } else if (event.data?.action === 'triggerSettingsUpdate') {
        await triggerSettingsUpdate(event.data?.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  // The iframe will load /live-spinner/options, which will redirect to auth if needed
  // The auth pages will then redirect back to /live-spinner/options after login
  return (
    <div className="w-full h-screen bg-background">
      <iframe
        ref={iframeRef}
        src={`${WEBSITE_URL}/live-spinner/options`}
        className="w-full h-full border-0"
        allow="clipboard-write; clipboard-read"
        title="DrawDay Spinner Options"
        style={{ border: 'none' }}
      />
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OptionsIframe />
    </React.StrictMode>
  );
}