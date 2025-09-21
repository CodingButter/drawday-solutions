import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

// For development, always use localhost
// Change this to 'https://www.drawday.app' for production builds
const WEBSITE_URL = 'http://localhost:3000';

console.log('DrawDay Extension URL:', WEBSITE_URL);

function SidePanelIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Function to notify iframe of settings update
    const triggerSettingsUpdate = (data?: unknown) => {
      console.log('[SidePanel] Notifying iframe of settings update', data);
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'trigger-settings-update', data },
          WEBSITE_URL
        );
      }
    };

    // Listen for messages from background script
    const handleMessage = (message: Record<string, unknown>) => {
      if (message.action === 'triggerSettingsUpdate') {
        triggerSettingsUpdate(message.data);
      }
    };

    // Add listener
    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <iframe
        ref={iframeRef}
        src={`${WEBSITE_URL}/live-spinner/spinner`}
        className="w-full h-full border-0"
        allow="clipboard-write; clipboard-read"
        title="DrawDay Spinner"
      />
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <SidePanelIframe />
    </React.StrictMode>
  );
}