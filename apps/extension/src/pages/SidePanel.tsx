import { useEffect, useRef } from 'react';
import { WEBSITE_URL, IFRAME_URLS } from '@/config';

export function SidePanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Handle messages from the iframe
    const handleMessage = async (event: MessageEvent) => {
      // Only accept messages from our website
      if (event.origin !== WEBSITE_URL) return;

      const { type, payload } = event.data;

      switch (type) {
        case 'GET_AUTH_TOKEN':
          // Get Firebase auth token from extension storage
          chrome.storage.local.get(['authToken'], (result) => {
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'AUTH_TOKEN', payload: result.authToken },
              WEBSITE_URL
            );
          });
          break;

        case 'SET_AUTH_TOKEN':
          // Store auth token in extension storage
          chrome.storage.local.set({ authToken: payload.token });
          break;

        case 'SPINNER_COMPLETE':
          // Handle spinner completion events
          console.log('Spinner completed with winner:', payload.winner);
          break;

        default:
          console.log('Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);

    // Send initial handshake when iframe loads
    const handleIframeLoad = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'HANDSHAKE', payload: { isExtension: true, isSidePanel: true } },
        WEBSITE_URL
      );
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <iframe
        ref={iframeRef}
        src={IFRAME_URLS.spinner}
        className="w-full h-full border-none"
        title="DrawDay Spinner"
      />
    </div>
  );
}
