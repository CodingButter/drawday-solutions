# Firebase Authentication Setup

## Overview

This project uses Firebase Authentication to manage user login for the Chrome extension. Users register through the website and can then log in to use the extension.

## Firebase Project

- **Project ID**: bettermade-spinpick
- **Project Name**: bettermade-spinpick

## Setup Instructions

### 1. Enable Firebase Authentication

```bash
# Go to Firebase Console
https://console.firebase.google.com/project/bettermade-spinpick/authentication

# Enable Email/Password authentication method
```

### 2. Get Firebase Configuration

1. Go to Project Settings in Firebase Console
2. Under "Your apps", click "Add app" > "Web"
3. Register the app with a nickname (e.g., "DrawDay Website")
4. Copy the configuration values

### 3. Set Environment Variables

#### For Website (apps/website/.env.local)

```env
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bettermade-spinpick.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bettermade-spinpick
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bettermade-spinpick.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=bettermade-spinpick
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"
```

### 4. Get Service Account Key (for Admin SDK)

1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Extract the values for:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 5. Update Extension Firebase Config

Edit `apps/extension/src/services/firebase-config.ts` with your Firebase config values.

### 6. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Authentication Flow

1. **User Registration** (Website)
   - User fills out registration form on website
   - API route creates user in Firebase Auth
   - User document created in Firestore

2. **User Login** (Website)
   - User logs in with email/password
   - Firebase Client SDK authenticates
   - Session cookie created for server-side auth

3. **Extension Authentication**
   - User opens extension
   - If not logged in, shows login form
   - User enters same credentials
   - Extension stores auth state in Chrome storage

## Database Structure

### Firestore Collections

#### users/{userId}

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T00:00:00Z",
  "role": "user",
  "extensionEnabled": true
}
```

#### competitions/{competitionId}

```json
{
  "name": "Competition Name",
  "userId": "owner_user_id",
  "participants": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Security Rules

Firestore rules are defined in `firestore.rules`:

- Users can only read/write their own user document
- Authenticated users can read competitions
- Only admin users can write competitions

## Testing

1. Start the website development server:

```bash
pnpm --filter @raffle-spinner/website dev
```

2. Register a new user at http://localhost:3000/register

3. Log in at http://localhost:3000/login

4. Build and load the extension:

```bash
pnpm --filter @raffle-spinner/extension build
```

5. Load the extension in Chrome and verify authentication works

## Troubleshooting

### "Permission Denied" Errors

- Check Firestore rules
- Verify user is authenticated
- Check Firebase project settings

### Authentication Not Persisting

- Verify Chrome storage permissions in manifest.json
- Check auth state persistence settings

### API Key Issues

- Ensure environment variables are set correctly
- Restart Next.js dev server after changing .env.local
- Check Firebase project settings for correct API keys
