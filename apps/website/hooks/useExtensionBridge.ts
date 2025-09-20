import { useEffect, useState, useCallback } from 'react';

interface ExtensionContext {
  isExtension: boolean;
  isSidePanel: boolean;
}

export function useExtensionBridge() {
  const [isInIframe, setIsInIframe] = useState(false);
  const [extensionContext, setExtensionContext] = useState<ExtensionContext | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if running in iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    if (inIframe) {
      // Handle messages from parent (extension)
      const handleMessage = (event: MessageEvent) => {
        // Accept messages from chrome extensions
        if (!event.origin.startsWith('chrome-extension://')) {
          console.log('Ignoring message from non-extension origin:', event.origin);
          return;
        }

        const { type, payload } = event.data;

        switch (type) {
          case 'HANDSHAKE':
            setExtensionContext(payload);
            // Request auth token after handshake
            window.parent.postMessage({ type: 'GET_AUTH_TOKEN' }, '*');
            break;

          case 'AUTH_TOKEN':
            setAuthToken(payload);
            break;

          default:
            console.log('Unknown message type:', type);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  const openSidePanel = useCallback(() => {
    if (isInIframe && extensionContext?.isExtension) {
      // Send message to extension to open side panel
      window.parent.postMessage({ type: 'OPEN_SIDEPANEL' }, '*');
    } else {
      // Open in new window if not in extension
      window.open('/live-spinner/spinner', '_blank', 'width=400,height=800');
    }
  }, [isInIframe, extensionContext]);

  const saveAuthToken = useCallback((token: string) => {
    setAuthToken(token);
    if (isInIframe && extensionContext?.isExtension) {
      // Send token to extension for storage
      window.parent.postMessage({ type: 'SET_AUTH_TOKEN', payload: { token } }, '*');
    }
  }, [isInIframe, extensionContext]);

  const notifySpinnerComplete = useCallback((winner: any) => {
    if (isInIframe && extensionContext?.isSidePanel) {
      // Notify extension of spinner completion
      window.parent.postMessage({ type: 'SPINNER_COMPLETE', payload: { winner } }, '*');
    }
  }, [isInIframe, extensionContext]);

  return {
    isInIframe,
    isExtension: extensionContext?.isExtension || false,
    isSidePanel: extensionContext?.isSidePanel || false,
    authToken,
    openSidePanel,
    saveAuthToken,
    notifySpinnerComplete,
  };
}