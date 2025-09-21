import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';
import { WEBSITE_URL } from './config';

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
          data: data,
        });
      } catch (error) {
        console.error('Failed to trigger settings update:', error);
      }
    };

    // Listen for messages from the iframe (cross-origin communication)
    const handleMessage = async (event: MessageEvent) => {
      console.log('[Extension] Received message:', event.data, 'from origin:', event.origin);

      // Verify origin for security
      if (event.origin !== WEBSITE_URL) {
        console.log(
          '[Extension] Ignoring message from unexpected origin:',
          event.origin,
          'expected:',
          WEBSITE_URL
        );
        return;
      }

      if (event.data?.action === 'openSidePanel') {
        console.log('[Extension] Opening side panel...');
        await openSidePanel();
      } else if (event.data?.action === 'triggerSettingsUpdate') {
        console.log('[Extension] Triggering settings update...');
        await triggerSettingsUpdate(event.data?.data);
      } else {
        console.log('[Extension] Unknown action:', event.data?.action);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
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
