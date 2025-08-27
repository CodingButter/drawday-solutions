import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

// Get the website URL - in production this would be your deployed website
const WEBSITE_URL = import.meta.env.PROD 
  ? 'https://drawday.app' // Replace with your production URL
  : 'http://localhost:3000';

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

    // Wait for iframe to load and inject the function
    const handleIframeLoad = () => {
      console.log('Iframe loaded, attempting to inject openSidepanel function');
      if (iframeRef.current?.contentWindow) {
        try {
          // Inject the openSidepanel function into the iframe's window
          (iframeRef.current.contentWindow as any).openSidepanel = openSidePanel;
          console.log('Successfully injected openSidepanel function');
        } catch (error) {
          console.error('Failed to inject function, will use postMessage fallback:', error);
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

  return (
    <div className="w-full h-screen bg-background">
      <iframe
        ref={iframeRef}
        src={`${WEBSITE_URL}/live-spinner/options`}
        className="w-full h-full border-0"
        allow="clipboard-write; clipboard-read"
        title="DrawDay Spinner Options"
        // Remove sandbox to avoid the warning - extension iframes are already isolated
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