import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export async function GET() {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDwlT7l0Kg-DpJh4ZMQw57TjS7BjF51Tgc',
      authDomain:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'bettermade-spinpick.firebaseapp.com',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'bettermade-spinpick',
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        'bettermade-spinpick.firebasestorage.app',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '966664984512',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:966664984512:web:6c4cc0dbb5e43346271a25',
    };

    // Check if Firebase is already initialized
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    const auth = getAuth(app);

    return NextResponse.json({
      success: true,
      config: {
        apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        appId: firebaseConfig.appId ? 'Set' : 'Missing',
      },
      authSettings: {
        currentUser: auth.currentUser ? auth.currentUser.email : null,
        authDomain: auth.app.options.authDomain,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
