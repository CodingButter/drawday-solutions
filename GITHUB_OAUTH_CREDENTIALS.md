# GitHub OAuth Application Created

## Application Details

- **Application Name**: DrawDay Spinner
- **Client ID**: `Ov23lilI8iYAF9RGOg5Z`
- **Homepage URL**: https://bettermade-spinpick.web.app
- **Authorization Callback URL**: https://bettermade-spinpick.firebaseapp.com/__/auth/handler

## Next Steps to Complete Setup

### 1. Generate Client Secret Manually

Since I can see the "Generate a new client secret" button but cannot click it programmatically, please:

1. Click the "Generate a new client secret" button that's visible on the screen
2. Copy the generated secret immediately (it will only be shown once)
3. Save it securely

### 2. Add to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (bettermade-spinpick)
3. Navigate to Authentication > Sign-in method
4. Click on GitHub provider
5. Enable it
6. Add:
   - **Client ID**: `Ov23lilI8iYAF9RGOg5Z`
   - **Client Secret**: [The secret you generated]
7. Save the configuration

### 3. Verify Callback URL

Firebase will show you the callback URL after saving. It should be:
`https://bettermade-spinpick.firebaseapp.com/__/auth/handler`

If it's different, update the GitHub OAuth app with the correct callback URL.

## Testing the Integration

### In Development

1. Run the website locally:
   ```bash
   pnpm --filter @raffle-spinner/website dev
   ```
2. Navigate to http://localhost:3000
3. Try signing in with GitHub

### In Extension

1. Build the extension:
   ```bash
   pnpm --filter @raffle-spinner/extension build
   ```
2. Load the extension in Chrome
3. Test GitHub authentication

## Important Security Notes

- Never commit the Client Secret to your repository
- Store it securely in your password manager
- Rotate the secret periodically for security
- Monitor the OAuth app usage in GitHub settings
