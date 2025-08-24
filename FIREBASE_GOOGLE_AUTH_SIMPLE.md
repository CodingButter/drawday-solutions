# Simple Google Auth Setup with Firebase

## Easier Alternative: Use Firebase's Built-in Google Auth

Since your project is hosted on Firebase, you can use their simplified Google authentication without creating custom OAuth credentials.

### Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Sign in with: jamie337nichols@gmail.com
3. Select your project: `bettermade-spinpick`
4. Navigate to **Authentication** > **Sign-in method**
5. Find **Google** in the provider list
6. Click on it to configure
7. Toggle **Enable** to ON
8. For **Project support email**, enter: jamie337nichols@gmail.com
9. Click **Save**

That's it! Firebase automatically handles the OAuth configuration for you.

### Step 2: Update Your Code (if needed)

Your Firebase config in `apps/extension/src/services/firebase-config.ts` already has everything needed:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDwlT7l0Kg-DpJh4ZMQw57TjS7BjF51Tgc",
  authDomain: "bettermade-spinpick.firebaseapp.com",
  projectId: "bettermade-spinpick",
  storageBucket: "bettermade-spinpick.firebasestorage.app",
  messagingSenderId: "966664984512",
  appId: "1:966664984512:web:6c4cc0dbb5e43346271a25",
};
```

### Step 3: Implement Google Sign-In

For the website (`apps/website`), the sign-in code would look like:

```typescript
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // User is signed in
    console.log("Signed in user:", user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};
```

### Advantages of This Approach:

- ✅ No need to create OAuth credentials manually
- ✅ No Client ID/Secret to manage
- ✅ Works immediately after enabling in Firebase
- ✅ Automatically handles all redirect URIs
- ✅ Works with localhost, staging, and production
- ✅ Google won't block sign-ins

### Testing

1. Start your website:
   ```bash
   pnpm --filter @raffle-spinner/website dev
   ```
2. Go to http://localhost:3000
3. Click "Sign in with Google"
4. You should see Google's sign-in popup

This is much simpler than setting up custom OAuth credentials!
