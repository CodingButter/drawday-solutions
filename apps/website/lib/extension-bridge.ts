/**
 * Extension Bridge
 *
 * Provides communication between the options page and spinner
 * Supports both iframe (extension) and popup window scenarios
 */

type MessageHandler = (data: any) => void;
type UpdateListener = () => void;

interface ExtensionBridge {
  isInIframe: boolean;
  isExtension: boolean;
  triggerSettingsUpdate: (data?: any) => void;
  onSettingsUpdate: (callback: UpdateListener) => () => void;
  openSidePanel?: () => Promise<void>;
}

class ExtensionBridgeImpl implements ExtensionBridge {
  private updateListeners = new Set<UpdateListener>();
  private broadcastChannel: BroadcastChannel | null = null;
  private messageQueue: any[] = [];
  private isReady = false;

  public readonly isInIframe: boolean;
  public readonly isExtension: boolean;
  public openSidePanel?: () => Promise<void>;

  constructor() {
    // Detect environment
    this.isInIframe = window !== window.parent;
    this.isExtension = typeof window !== 'undefined' &&
                       !!(window as any).chrome?.runtime?.id;

    // Initialize based on environment
    this.initialize();
  }

  private initialize() {
    // Set up BroadcastChannel for all scenarios
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('drawday-settings-sync');

      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'settings-update') {
          this.notifyListeners();
        }
      };
    }

    if (this.isInIframe) {
      // We're in an iframe - set up postMessage listener
      window.addEventListener('message', this.handleMessage);

      // Check if extension functions are available
      if ((window as any).openSidepanel) {
        this.openSidePanel = (window as any).openSidepanel;
      }

      // Let parent know we're ready
      window.parent.postMessage({ type: 'iframe-ready' }, '*');
    } else {
      // We're not in an iframe - could be main window or popup
      window.addEventListener('message', this.handleMessage);

      // If we opened a popup, establish connection
      if (window.opener) {
        window.opener.postMessage({ type: 'popup-ready' }, '*');
      }
    }

    this.isReady = true;
    this.processMessageQueue();
  }

  private handleMessage = (event: MessageEvent) => {
    // Security check - only accept messages from same origin
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data?.type === 'settings-update') {
      this.notifyListeners();
    } else if (event.data?.type === 'trigger-settings-update') {
      this.notifyListeners();
    }
  };

  private notifyListeners() {
    this.updateListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in settings update listener:', error);
      }
    });
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const data = this.messageQueue.shift();
      this.sendUpdate(data);
    }
  }

  private sendUpdate(data: any) {
    const message = {
      type: 'settings-update',
      timestamp: Date.now(),
      ...data
    };

    // Broadcast to all channels
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }

    // Send via postMessage if in iframe
    if (this.isInIframe) {
      window.parent.postMessage(message, '*');
    }

    // Send to popup if we have one
    if (window.opener) {
      window.opener.postMessage(message, '*');
    }

    // Send to any child iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, '*');
      }
    });
  }

  public triggerSettingsUpdate = (data?: any) => {
    console.log('[ExtensionBridge] Triggering settings update', data);

    if (!this.isReady) {
      this.messageQueue.push(data);
      return;
    }

    this.sendUpdate(data);

    // Also notify local listeners immediately
    this.notifyListeners();
  };

  public onSettingsUpdate = (callback: UpdateListener): (() => void) => {
    this.updateListeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.updateListeners.delete(callback);
    };
  };

  public destroy() {
    window.removeEventListener('message', this.handleMessage);

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    this.updateListeners.clear();
  }
}

// Create singleton instance
let bridgeInstance: ExtensionBridgeImpl | null = null;

export function getExtensionBridge(): ExtensionBridge {
  if (!bridgeInstance) {
    bridgeInstance = new ExtensionBridgeImpl();
  }
  return bridgeInstance;
}

export function destroyExtensionBridge() {
  if (bridgeInstance) {
    bridgeInstance.destroy();
    bridgeInstance = null;
  }
}