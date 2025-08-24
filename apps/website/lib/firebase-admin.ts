import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Only initialize if we have the necessary environment variables
const hasAdminCreds =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

let adminApp: any = null;
let adminAuth: any = null;
let adminDb: any = null;

if (hasAdminCreds) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  };

  // Initialize Firebase Admin
  adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} else {
  console.warn('Firebase Admin SDK not initialized: Missing environment variables');
}

export { adminAuth, adminDb };
export default adminApp;
