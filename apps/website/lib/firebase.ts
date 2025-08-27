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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId,
  });
}

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
