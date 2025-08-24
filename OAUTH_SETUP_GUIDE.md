# OAuth Provider Setup Guide

This guide will walk you through setting up OAuth authentication for Google and GitHub in your Firebase project.

## Prerequisites

- Firebase project created and configured
- Access to developer consoles for each provider

## 1. Google OAuth Setup

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"

### Step 2: Configure OAuth Consent Screen

1. Click on "OAuth consent screen" in the sidebar
2. Choose "External" user type
3. Fill in the required information:
   - App name: "DrawDay Spinner"
   - User support email: Your email
   - Developer contact information: Your email
4. Add authorized domains:
   - `drawday-spinner.firebaseapp.com`
   - `drawday-spinner.web.app`
   - Your custom domain (if applicable)
5. Save and continue through scopes (default is fine)

### Step 3: Create OAuth 2.0 Client ID

1. Go to "Credentials" tab
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Name: "DrawDay Spinner Web"
5. Add Authorized redirect URIs:
   ```
   https://drawday-spinner.firebaseapp.com/__/auth/handler
   https://drawday-spinner.web.app/__/auth/handler
   http://localhost:3000/__/auth/handler
   ```
6. Click "Create"
7. Copy the Client ID and Client Secret

### Step 4: Enable in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable Google provider
5. Add the Client ID and Client Secret from Step 3
6. Add your domain to authorized domains

## 2. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > [OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "DrawDay Spinner"
   - Homepage URL: `https://drawday-spinner.web.app` (or your domain)
   - Authorization callback URL: `https://drawday-spinner.firebaseapp.com/__/auth/handler`
4. Click "Register application"

### Step 2: Get Credentials

1. Copy the Client ID
2. Click "Generate a new client secret"
3. Copy the Client Secret (save it immediately, it won't be shown again)

### Step 3: Enable in Firebase

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable GitHub provider
3. Add the Client ID and Client Secret from Step 2
4. Copy the authorization callback URL shown by Firebase
5. Go back to your GitHub OAuth App settings and update the callback URL if needed

## 3. Update Your Application

### Update Firebase Config (Extension)

Edit `apps/extension/src/services/firebase-config.ts`:

```typescript
// Your config should already have these fields from Firebase
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "drawday-spinner.firebaseapp.com",
  projectId: "drawday-spinner",
  storageBucket: "drawday-spinner.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

### Update Environment Variables (Website)

Edit `apps/website/.env.local`:

```bash
# These should already be set from Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=drawday-spinner.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=drawday-spinner
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=drawday-spinner.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# OAuth providers are configured in Firebase Console
# No additional env vars needed for OAuth
```

## 4. Test OAuth Flows

### Local Testing

1. Start the website: `pnpm --filter @raffle-spinner/website dev`
2. Navigate to http://localhost:3000
3. Try signing in with each provider

### Extension Testing

1. Build the extension: `pnpm --filter @raffle-spinner/extension build`
2. Load the extension in Chrome
3. Open the extension and test authentication

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in your OAuth app matches exactly what Firebase expects
   - Check for trailing slashes and protocol (http vs https)

2. **"Invalid client" error**
   - Double-check Client ID and Secret are correctly copied
   - Ensure no extra spaces or characters

3. **GitHub returns 404**
   - The callback URL in GitHub OAuth app doesn't match Firebase's handler

## Security Notes

- Never commit OAuth credentials to your repository
- Use environment variables for sensitive data
- Regularly rotate client secrets
- Monitor OAuth app usage in each provider's dashboard
- Consider implementing rate limiting and abuse prevention

## Next Steps

After setting up OAuth providers:

1. Test each authentication method thoroughly
2. Implement proper error handling for auth failures
3. Set up user profile management
4. Configure Firestore security rules for authenticated users
5. Add logout functionality
6. Implement auth state persistence
