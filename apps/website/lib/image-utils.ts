/**
 * Upload an image to Directus
 * @param image Base64 image data URL
 * @param filename Optional filename
 * @param title Optional title for the file
 * @returns Directus file ID and URL
 */
export async function uploadImageToDirectus(
  image: string,
  filename?: string,
  title?: string
): Promise<{ id: string; url: string }> {
  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image, filename, title }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log(`Image uploaded to Directus: ${data.file.id}`);

    return {
      id: data.file.id,
      url: data.url,
    };
  } catch (error) {
    console.error('Error uploading image to Directus:', error);
    throw error;
  }
}

/**
 * Get Directus asset URL from file ID
 * @param fileId Directus file ID
 * @returns Full URL to the asset
 */
export function getDirectusAssetUrl(fileId: string): string {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
  return `${directusUrl}/assets/${fileId}`;
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

  // Upload image to Directus and return the file ID
  async storeImage(imageData: string): Promise<string> {
    try {
      const result = await uploadImageToDirectus(imageData);
      return result.id; // Return Directus file ID
    } catch (error) {
      console.error('Failed to upload to Directus, falling back to IndexedDB:', error);
      // Fallback to IndexedDB storage
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.saveImage(imageId, imageData);
      return imageId;
    }
  }

  // Get image URL - check if it's a Directus file ID or IndexedDB ID
  async getImageUrl(id: string): Promise<string | null> {
    // If it looks like a Directus UUID, return the asset URL
    if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return getDirectusAssetUrl(id);
    }

    // Otherwise, get from IndexedDB
    return await this.getImage(id);
  }
}

export const imageStore = new ImageStore();