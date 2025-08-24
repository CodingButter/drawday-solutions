# Enable OAuth Providers in Firebase

Since automated sign-in is blocked by Google's security, you'll need to manually enable the OAuth providers. Here's the quickest way:

## Step 1: Firebase CLI Login

Run this in your terminal:

```bash
firebase login
```

This will open your browser for authentication.

## Step 2: Manual Firebase Console Setup

### Quick Links (after you're logged in):

1. **Direct link to Authentication Providers**:
   https://console.firebase.google.com/project/bettermade-spinpick/authentication/providers

2. **Enable Google Sign-In**:
   - Click on "Google" in the provider list
   - Toggle "Enable"
   - Set support email to: jamie337nichols@gmail.com
   - Click "Save"
   - ✅ Done! No OAuth credentials needed

3. **Enable GitHub Sign-In**:
   - Click on "GitHub" in the provider list
   - Toggle "Enable"
   - Add Client ID: `Ov23lilI8iYAF9RGOg5Z`
   - Add Client Secret: (the one you generated from GitHub)
   - Click "Save"
   - ✅ Done!

## Step 3: Verify Configuration

Run this command to verify your project:

```bash
firebase use bettermade-spinpick
```

## OAuth Implementation Code

The authentication is already partially implemented. Here's what you need for the website:

### For `apps/website/app/api/auth/login/route.ts`:

```typescript
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// GitHub Sign-In
export const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};
```

### Update the login page handler:

The `handleSocialLogin` function in `apps/website/app/login/page.tsx` should be updated:

```typescript
const handleSocialLogin = async (provider: string) => {
  setLoading(true);
  setError("");

  try {
    let result;
    if (provider === "Google") {
      const googleProvider = new GoogleAuthProvider();
      result = await signInWithPopup(auth, googleProvider);
    } else if (provider === "GitHub") {
      const githubProvider = new GithubAuthProvider();
      result = await signInWithPopup(auth, githubProvider);
    }

    if (result?.user) {
      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      );

      // Redirect to dashboard
      router.push("/dashboard");
    }
  } catch (error: any) {
    console.error(`${provider} login error:`, error);
    setError(error.message || `${provider} login failed`);
  } finally {
    setLoading(false);
  }
};
```

## Testing

After enabling the providers in Firebase Console:

1. Start the dev server:

```bash
pnpm --filter @raffle-spinner/website dev
```

2. Navigate to http://localhost:3000/login

3. Test both Google and GitHub sign-in buttons

## Notes

- Google Sign-In with Firebase doesn't require manual OAuth credential creation
- GitHub requires the Client ID and Secret from the OAuth app you created
- Both will work on localhost, staging, and production automatically
