import {
  doc,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
  query,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase-config';

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  onChange<T>(key: string, callback: (value: T | null) => void): () => void;
}

export class FirestoreStorageAdapter implements StorageAdapter {
  private userId: string;
  private listeners: Map<string, Unsubscribe> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  private getDocRef(key: string) {
    // Map storage keys to Firestore paths
    const [category, ...rest] = key.split('.');
    const docId = rest.join('.');

    if (category === 'competitions') {
      return doc(db, 'users', this.userId, 'competitions', docId || 'list');
    } else if (category === 'settings') {
      return doc(db, 'users', this.userId, 'settings', 'config');
    } else if (category === 'theme') {
      return doc(db, 'users', this.userId, 'theme', 'config');
    } else if (category === 'columnMapping') {
      return doc(db, 'users', this.userId, 'columnMapping', 'config');
    } else if (category === 'savedMappings') {
      return doc(db, 'users', this.userId, 'savedMappings', docId || 'list');
    } else {
      return doc(db, 'users', this.userId, 'data', key);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(key);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const docRef = this.getDocRef(key);
      await setDoc(docRef, value as any, { merge: true });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const docRef = this.getDocRef(key);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // Clear all user data collections
      const collections = [
        'competitions',
        'settings',
        'theme',
        'columnMapping',
        'savedMappings',
        'data',
      ];

      for (const collectionName of collections) {
        const collectionRef = collection(db, 'users', this.userId, collectionName);
        const snapshot = await getDocs(query(collectionRef));

        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  onChange<T>(key: string, callback: (value: T | null) => void): () => void {
    // Remove existing listener if any
    const existingListener = this.listeners.get(key);
    if (existingListener) {
      existingListener();
    }

    const docRef = this.getDocRef(key);
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error listening to ${key}:`, error);
        callback(null);
      }
    );

    this.listeners.set(key, unsubscribe);

    // Return cleanup function
    return () => {
      unsubscribe();
      this.listeners.delete(key);
    };
  }

  // Clean up all listeners
  destroy() {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }
}
