import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  connectAuthEmulator,
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDwlT7l0Kg-DpJh4ZMQw57TjS7BjF51Tgc',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'bettermade-spinpick.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'bettermade-spinpick',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'bettermade-spinpick.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '966664984512',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:966664984512:web:6c4cc0dbb5e43346271a25',
};

// Initialize Firebase only if it hasn't been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Temporarily disable App Check initialization during development
  // to resolve authentication issues
  /*
  // Initialize App Check with debug token in development
  if (typeof window !== 'undefined') {
    // In development, use debug token to bypass App Check
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - This enables debug mode
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    // Initialize App Check
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
    }
  }
  */
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Note: Firebase emulators would bypass App Check but require Java
// For now, you'll need to disable App Check enforcement in Firebase Console
// Go to: https://console.firebase.google.com/project/bettermade-spinpick/appcheck
// and disable enforcement for your web app during development

// OAuth Providers - Configure with additional scopes if needed
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

export default app;
