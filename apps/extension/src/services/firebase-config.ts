import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getStorageEnvironment } from '@raffle-spinner/storage';

// Firebase configuration from environment variables
// These should be set in .env file (see .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check with ReCaptcha v3 in production
// In development, we'll use debug token
const isWebMode = getStorageEnvironment() === 'web';
const isDevelopment = import.meta.env.DEV;

if (typeof window !== 'undefined') {
  // Only initialize App Check in browser environment
  if (isDevelopment) {
    // Use debug token for development
    (window as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  // Initialize App Check with ReCaptcha provider
  // You'll need to add your ReCaptcha site key here
  // For now, we'll skip App Check in development
  if (!isDevelopment) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.warn('App Check initialization failed:', error);
    }
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication state management
export const checkAuthStatus = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Sign in with custom token from website
export const signInWithToken = async (token: string) => {
  try {
    const userCredential = await signInWithCustomToken(auth, token);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with custom token:', error);
    throw error;
  }
};

// Store auth state in storage
export const saveAuthState = async (user: User) => {
  const authUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  if (isWebMode) {
    localStorage.setItem('authUser', JSON.stringify(authUser));
  } else {
    await chrome.storage.local.set({ authUser });
  }
};

// Clear auth state from storage
export const clearAuthState = async () => {
  if (isWebMode) {
    localStorage.removeItem('authUser');
  } else {
    await chrome.storage.local.remove('authUser');
  }
};

// Get auth state from storage
export const getStoredAuthState = async () => {
  try {
    if (isWebMode) {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } else {
      const result = await chrome.storage.local.get('authUser');
      return result.authUser || null;
    }
  } catch (error) {
    console.error('Error getting stored auth state:', error);
    return null;
  }
};