# Google OAuth Setup Instructions

Google blocks automated browser sign-ins for security. Please follow these manual steps:

## Step 1: Sign in to Google Cloud Console

1. Open your regular browser (Chrome, Firefox, etc.)
2. Go to: https://console.cloud.google.com
3. Sign in with your Google account: jamie337nichols@gmail.com

## Step 2: Create or Select a Project

1. In the top navigation bar, click on the project dropdown
2. Click "New Project" if you don't have one
3. Name it: "DrawDay Spinner" or "BetterMade SpinPick"
4. Click "Create"

## Step 3: Enable APIs

1. In the left sidebar, go to "APIs & Services" > "Enabled APIs"
2. Click "+ ENABLE APIS AND SERVICES"
3. Search for "Google+ API" or "Google Identity"
4. Enable it

## Step 4: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Click "Create"
4. Fill in the required fields:
   - **App name**: DrawDay Spinner
   - **User support email**: jamie337nichols@gmail.com
   - **Developer contact email**: jamie337nichols@gmail.com
5. Add Authorized domains:
   - `bettermade-spinpick.firebaseapp.com`
   - `bettermade-spinpick.web.app`
6. Click "Save and Continue"
7. On Scopes page, just click "Save and Continue" (default scopes are fine)
8. On Test users page, click "Save and Continue"
9. Review and click "Back to Dashboard"

## Step 5: Create OAuth 2.0 Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Name: "DrawDay Spinner Web"
5. Add Authorized JavaScript origins:
   ```
   https://bettermade-spinpick.firebaseapp.com
   https://bettermade-spinpick.web.app
   http://localhost:3000
   ```
6. Add Authorized redirect URIs:
   ```
   https://bettermade-spinpick.firebaseapp.com/__/auth/handler
   https://bettermade-spinpick.web.app/__/auth/handler
   http://localhost:3000/__/auth/handler
   ```
7. Click "Create"

## Step 6: Save Your Credentials

After creating, you'll see a popup with:

- **Client ID**: Copy this
- **Client Secret**: Copy this

Save these securely - you'll need them for Firebase.

## Step 7: Add to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `bettermade-spinpick`
3. Go to Authentication > Sign-in method
4. Find and click on "Google"
5. Enable it
6. Add:
   - **Web SDK configuration Client ID**: [Your Client ID from Step 6]
   - **Web SDK configuration Client Secret**: [Your Client Secret from Step 6]
7. Add your domain to Authorized domains if not already there
8. Click "Save"

## Credentials to Save

```javascript
// Save these in a secure location (password manager)
const googleOAuthConfig = {
  clientId: "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
  clientSecret: "YOUR_CLIENT_SECRET_HERE",
};
```

## Testing Google OAuth

### Test in Development

1. Run the website:
   ```bash
   pnpm --filter @raffle-spinner/website dev
   ```
2. Go to http://localhost:3000
3. Click "Sign in with Google"
4. You should see Google's sign-in page
5. Complete the authentication

### Test in Extension

1. Build the extension:
   ```bash
   pnpm --filter @raffle-spinner/extension build
   ```
2. Load the extension in Chrome
3. Test Google sign-in

## Common Issues

### "Error 400: redirect_uri_mismatch"

- The redirect URI doesn't match exactly
- Check for trailing slashes
- Make sure you added all variants (with and without www, http/https)

### "This app hasn't been verified"

- This is normal for development
- Click "Advanced" > "Go to [App Name] (unsafe)"
- For production, you'll need to verify your app with Google

### "Access blocked: Authorization Error"

- Check that APIs are enabled
- Verify OAuth consent screen is configured
- Ensure test users are added (if in testing mode)

## Next Steps

After setting up Google OAuth:

1. ✅ Test Google authentication
2. ✅ Verify GitHub OAuth is also working
3. ✅ Test both providers in development
4. ✅ Deploy and test in production
