# Firebase Production Setup

## Critical Configuration Steps

### 1. Add Authorized Domain to Firebase Console

You need to add the Vercel production domain to Firebase's authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/u/0/project/drawday-solutions/authentication/settings)
2. Navigate to **Authentication** → **Settings** → **Authorized domains**
3. Add these domains:
   - `project-n2lozttt5-codingbutters-projects.vercel.app`
   - `project-j3bf8gokm-codingbutters-projects.vercel.app`
   - `*.vercel.app` (for all Vercel preview deployments)

### 2. Configure Firestore CORS Rules

The Firestore errors (400 Bad Request) are likely due to CORS configuration. You need to:

1. Go to **Firestore Database** → **Rules**
2. Ensure your rules allow the production domain:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to manage their competitions
    match /competitions/{competitionId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || resource.data.public == true);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Allow authenticated users to manage their settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Update App Check (if enabled)

If Firebase App Check is enabled:

1. Go to **App Check** in Firebase Console
2. Register your web app with the production domain
3. Add the reCAPTCHA site key to your environment variables

### 4. Fix the React Import Issue

The "React is not defined" error suggests a build issue. This has been fixed in the code, but requires a new deployment.

### 5. Update Environment Variables

Make sure these are correctly set in Vercel:

```bash
# Update the APP_URL to match your production domain
NEXT_PUBLIC_APP_URL=https://project-n2lozttt5-codingbutters-projects.vercel.app
```

### 6. Google Cloud Console CORS

If the issue persists, you may need to configure CORS in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `drawday-solutions`
3. Go to **APIs & Services** → **Credentials**
4. Edit your API key restrictions to include the Vercel domains

### Immediate Actions Required:

1. **Add the Vercel domain to Firebase Authorized Domains** (this is the most critical step)
2. **Update Firestore rules** if needed
3. **Redeploy the application** after domain is authorized

### Testing After Configuration:

1. Clear browser cache and cookies
2. Try logging in again at: https://project-n2lozttt5-codingbutters-projects.vercel.app/auth/login
3. Check if Firestore operations work correctly

## Notes

- The CORS errors (400 Bad Request) are typically resolved by adding the domain to Firebase's authorized list
- The errors shown in the console are Firestore attempting to connect with WebChannel transport, which is being blocked by CORS
- Once the domain is authorized, these errors should disappear