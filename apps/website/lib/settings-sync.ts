/**
 * Settings Synchronization Service
 * Provides real-time updates across tabs/windows using multiple mechanisms
 */

type SettingsChangeEvent = {
  type: 'theme' | 'spinner' | 'competition' | 'column_mapping';
  data: any;
  timestamp: number;
  source: string;
};

type SettingsChangeListener = (event: SettingsChangeEvent) => void;

class SettingsSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SettingsChangeListener> = new Set();
  private storageKey = 'settings_sync';
  private lastUpdate: number = 0;
  private pollInterval: NodeJS.Timeout | null = null;
  private isLeader: boolean = false;
  private instanceId: string;

  constructor() {
    // Generate unique instance ID
    this.instanceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize if in browser
    if (typeof window !== 'undefined') {
      this.initializeBroadcastChannel();
      this.initializeStorageListener();
      this.initializeLeaderElection();
      this.startPolling();
    }
  }

  // Initialize BroadcastChannel for instant cross-tab communication
  private initializeBroadcastChannel() {
    try {
      // BroadcastChannel is supported in most modern browsers
      this.channel = new BroadcastChannel('drawday_settings_sync');

      this.channel.onmessage = (event: MessageEvent<SettingsChangeEvent>) => {
        // Don't process our own messages
        if (event.data.source === this.instanceId) return;

        this.notifyListeners(event.data);
      };
    } catch (error) {
      console.log('BroadcastChannel not supported, falling back to localStorage events');
    }
  }

  // Fallback to localStorage events for browsers without BroadcastChannel
  private initializeStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const data: SettingsChangeEvent = JSON.parse(event.newValue);

          // Don't process our own changes or old changes
          if (data.source === this.instanceId || data.timestamp <= this.lastUpdate) {
            return;
          }

          this.lastUpdate = data.timestamp;
          this.notifyListeners(data);
        } catch (error) {
          console.error('Failed to parse storage event:', error);
        }
      }
    });
  }

  // Leader election for API polling (only one tab polls the server)
  private initializeLeaderElection() {
    const leaderKey = 'settings_leader';

    // Try to become leader
    const tryBecomeLeader = () => {
      const now = Date.now();
      const currentLeader = localStorage.getItem(leaderKey);

      if (!currentLeader) {
        // No leader, become the leader
        localStorage.setItem(leaderKey, JSON.stringify({ id: this.instanceId, timestamp: now }));
        this.isLeader = true;
      } else {
        try {
          const leader = JSON.parse(currentLeader);
          // If leader is stale (>10 seconds), take over
          if (now - leader.timestamp > 10000) {
            localStorage.setItem(leaderKey, JSON.stringify({ id: this.instanceId, timestamp: now }));
            this.isLeader = true;
          } else {
            this.isLeader = leader.id === this.instanceId;
          }
        } catch (error) {
          // Invalid data, become leader
          localStorage.setItem(leaderKey, JSON.stringify({ id: this.instanceId, timestamp: now }));
          this.isLeader = true;
        }
      }
    };

    // Initial check
    tryBecomeLeader();

    // Heartbeat to maintain leadership
    setInterval(() => {
      if (this.isLeader) {
        localStorage.setItem(leaderKey, JSON.stringify({
          id: this.instanceId,
          timestamp: Date.now()
        }));
      } else {
        tryBecomeLeader();
      }
    }, 5000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (this.isLeader) {
        localStorage.removeItem(leaderKey);
      }
    });
  }

  // Polling mechanism (disabled - using event-driven updates instead)
  private startPolling() {
    // Polling disabled - now using extension bridge for event-driven updates
    // Settings are refreshed only when changes occur, not on a timer
  }

  // Subscribe to settings changes
  subscribe(listener: SettingsChangeListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Broadcast a settings change
  broadcastChange(event: SettingsChangeEvent) {
    // Add source if not present
    if (!event.source) {
      event.source = this.instanceId;
    }

    // Update timestamp
    event.timestamp = Date.now();
    this.lastUpdate = event.timestamp;

    // Broadcast via BroadcastChannel if available
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (error) {
        console.error('Failed to broadcast via BroadcastChannel:', error);
      }
    }

    // Also broadcast via localStorage for fallback
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(event));
      // Clean up after a short delay
      setTimeout(() => {
        if (localStorage.getItem(this.storageKey) === JSON.stringify(event)) {
          localStorage.removeItem(this.storageKey);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to broadcast via localStorage:', error);
    }

    // Notify local listeners
    this.notifyListeners(event);
  }

  // Notify all registered listeners
  private notifyListeners(event: SettingsChangeEvent) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in settings change listener:', error);
      }
    });
  }

  // Force refresh all settings
  forceRefresh() {
    this.broadcastChange({
      type: 'spinner',
      data: { trigger: 'force_refresh' },
      timestamp: Date.now(),
      source: this.instanceId
    });
  }

  // Clean up
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    this.listeners.clear();
  }
}

// Singleton instance
let syncServiceInstance: SettingsSyncService | null = null;

export function getSettingsSyncService(): SettingsSyncService {
  if (!syncServiceInstance && typeof window !== 'undefined') {
    syncServiceInstance = new SettingsSyncService();
  }
  return syncServiceInstance!;
}

export type { SettingsChangeEvent, SettingsChangeListener };
export { SettingsSyncService };