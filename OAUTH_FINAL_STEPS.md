# OAuth Configuration - Final Steps Required

## Current Status

The Firebase OAuth authentication is returning `auth/internal-error` because the Google Cloud OAuth consent screen needs to be configured. This is a **required step** that must be done manually in the Google Cloud Console.

## What's Already Done ✅

1. **Firebase Configuration**
   - Google OAuth enabled with Web Client ID: `966664984512-hl2qsdgjndnsbhgrlbu9n8p36nhg6mqd.apps.googleusercontent.com`
   - GitHub OAuth enabled with Client ID: `Ov23lilI8iYAF9RGOg5Z`
   - Public-facing name set to "DrawDay Spinner"
   - Support email configured
   - Localhost authorized for development

2. **Code Implementation**
   - Firebase SDK properly initialized
   - OAuth providers configured with scopes
   - Both popup and redirect authentication methods implemented
   - Error handling in place

## Manual Steps Required 🔧

### Step 1: Configure OAuth Consent Screen

You need to log into Google Cloud Console with your Google account and configure the OAuth consent screen:

1. **Go to**: https://console.cloud.google.com/apis/credentials/consent?project=bettermade-spinpick
2. **Sign in** with your Google account (jamienichols@codingbutter.com)
3. **Configure the OAuth consent screen**:
   - User Type: External (if you want anyone to sign in) or Internal (only your org)
   - App name: **DrawDay Spinner**
   - User support email: **jamienichols@codingbutter.com**
   - App logo: (optional, upload your logo)
   - Application home page: **http://localhost:3001** (for dev) or your production URL
   - Application privacy policy: (optional, add if you have one)
   - Application terms of service: (optional, add if you have one)
   - Authorized domains: Add your production domain when ready
   - Developer contact: **jamienichols@codingbutter.com**

4. **Add OAuth Scopes** (if prompted):
   - email
   - profile
   - openid

5. **Add Test Users** (if in testing mode):
   - Add your email and any test user emails

6. **Save and Continue** through all sections

### Step 2: Verify OAuth 2.0 Client IDs

While in Google Cloud Console, also verify:

1. Go to **APIs & Services > Credentials**
2. Check that you have a **Web application** OAuth 2.0 Client ID
3. Ensure these are in **Authorized JavaScript origins**:
   - `http://localhost`
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `https://bettermade-spinpick.firebaseapp.com`
4. Ensure these are in **Authorized redirect URIs**:
   - `http://localhost:3001/__/auth/handler`
   - `https://bettermade-spinpick.firebaseapp.com/__/auth/handler`

## Testing After Configuration

Once you've completed the OAuth consent screen configuration:

1. **Test with the debug page**:

   ```bash
   # Navigate to the test page
   http://localhost:3001/test-auth
   ```

2. **Or test on the main login page**:

   ```bash
   http://localhost:3001/login
   ```

3. Click on either:
   - Google sign-in button
   - GitHub sign-in button

## Expected Behavior After Configuration

- Clicking Google sign-in should open a Google account chooser/login popup
- Clicking GitHub sign-in should open a GitHub authorization page
- After successful authentication, users should be redirected to `/dashboard`
- User information will be stored in localStorage

## Troubleshooting

If OAuth still fails after configuration:

1. **Clear browser cache and cookies**
2. **Check browser console** for specific error messages
3. **Verify Firebase configuration**:
   - Ensure environment variables are loaded
   - Check that Firebase project ID matches
4. **Try in an incognito/private window**
5. **Check if popups are blocked** by your browser

## Alternative: Publishing Status

If you want to avoid the OAuth consent screen configuration for testing:

- Consider using **Email/Password authentication** which is already enabled
- Or use **Firebase Auth Emulator** for local development

## Important Notes

- The OAuth consent screen configuration is a Google requirement, not a Firebase limitation
- This only needs to be done once per project
- For production, you may need to submit for OAuth verification if using sensitive scopes

## Contact for Help

If you encounter issues:

1. Check Firebase Console logs: https://console.firebase.google.com/project/bettermade-spinpick/authentication/users
2. Review Google Cloud logs: https://console.cloud.google.com/logs
3. Firebase Support: https://firebase.google.com/support
