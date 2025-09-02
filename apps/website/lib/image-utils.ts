/**
 * Compress an image using the API route
 * @param image Base64 image data URL
 * @param type 'logo' or 'banner'
 * @returns Compressed base64 image data URL
 */
export async function compressImage(image: string, type: 'logo' | 'banner'): Promise<string> {
  try {
    const response = await fetch('/api/compress-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to compress image');
    }

    const data = await response.json();
    console.log(`Image compressed (${type}): ${data.reduction} reduction, from ${data.originalSize} to ${data.compressedSize} bytes`);
    
    return data.image;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original if compression fails
    return image;
  }
}

/**
 * Alternative: Use IndexedDB for larger storage capacity
 * IndexedDB can store up to 50% of available disk space
 */
class ImageStore {
  private dbName = 'DrawDayImages';
  private storeName = 'temporaryImages';
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveImage(id: string, imageData: string) {
    if (!this.db) await this.init();
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.put({
        id,
        data: imageData,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result?.data || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string) {
    if (!this.db) await this.init();
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cleanOldImages(maxAgeHours = 24) {
    if (!this.db) await this.init();
    
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

export const imageStore = new ImageStore();