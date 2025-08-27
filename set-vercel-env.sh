#!/bin/bash

# Firebase Client SDK Configuration
echo "AIzaSyDR2HWMQKbaSF9NIuG7Bf3Xl2eTqFvjllY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo "drawday-solutions.firebaseapp.com" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo "drawday-solutions" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo "drawday-solutions.firebasestorage.app" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo "378508608531" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo "1:378508608531:web:e8d7f8b7d52c0573252be6" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

# Firebase Admin SDK Configuration
echo "drawday-solutions" | vercel env add FIREBASE_PROJECT_ID production
echo "firebase-adminsdk-fbsvc@drawday-solutions.iam.gserviceaccount.com" | vercel env add FIREBASE_CLIENT_EMAIL production
echo "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLpOn5HysHHgfi\n2q1ktkeM2PWfZExQIu+jd9ACRggC7ME4gkzqLvxRx04nMHeskX/Iks3IpmhOI7xH\n2/KVUc8EnRhKOuFO2l8E4YGffl+5Wad0I8LCo/vEHZgHtaZPyrLJHYiOIikzlqtP\nvPF53Xv6aHucnCpYMUGCMN0iSpcgbbi5vNZqUu6fPdnN/epxj1ysp/fIbF7VVEzP\nK1jILXjIyDVSm7PUMDC0El0Ez6Y+HYX1Q6NBl04+12In5R+BrtYq9e0lSB1IXUAP\nlQFiqvh6nGK2ksOfvEZSJqWrh6jtivdUOJoYK+xxtH3LJjIu833lFlU8KWhgw19F\nvlp3UZo1AgMBAAECggEAHZ4NB1XgoKbd98DdIf4ett3hDz77mFYUaz5kKsh7ps0/\nJtRQkmil+tDVTX7PkPISVx3+vtVw6xhobD0RcWUWCjI806LvnNPGqQORIhyzmFXx\nNEN1MnC+D55MO6bQGt+8k+JvN1jBjEa4AJ9WsWYkf11NyQ+vWudDA0fPCYs2opkA\nGB7522VJAcWYkEkztG0i6Cc8nBln3aDkHVNTdhmk+bPMuCM2Ibz9s2D8cLEas15z\ncCoS+pl38w7dyo5REk5K9zDF+g0SFjaMpGla0TQbnGBZE1rF8WH4WJ60Ko+qbjYb\nbFOFVxKErkE3FcTEwU4qY4skmLYMH3n0LfaODiwGgQKBgQDwwDS1PHrNLelxR/62\n57+fx8Pd28icwSE57iZho7Gq172CIBlkyB5q3A7qNl6O02H37kB3/96tSxj8/Rw6\nAWbV55fRv2blWIYUax1XjvMfJ56W3k1qbjd4TY38Ivj98M9kEo5i3m3bM9NbT5bg\nzVir60BnHjYxcsaCk5XI+JDVwQKBgQDYiwV26gzQ2lDrz13dGtZSmDTpLlI+fFXx\nVy8jgEFwdx/hP2BCNdE/U9NE/qono9svhfimbJ2HAZuJgi3F29TaJtMA2m4dDrlS\nRAhiHR+6elOVP/YioGfYaOJJX6E2u/1f3WryTfvm3YqdbVDANcmdmLqEeUcjSDrH\nnUiEC+QpdQKBgHZQDtcOPM8+g92O4wdiBpLwKjqKeyFF7B07AxOyzWpHEbO0MKaN\njh03vgCt7XRFP30HUhlm3jjNkh8qCEgdTjtK0Bpc9KU7BtFb/pR8BNDHuLEt2F+4\ngHwXqPJDAZhSUqk8UUsXQmeaJYFXMK+TWsNKHmFOwJU2cYXUH6UfOpZBAoGBAIMt\nbIkF7e+TYVQIkc8Ak/cC94KOqgnqXlHOQ+MYrgvITkqwjsptOa5IRILWVxOeYohe\neyuuPptrcOKTNtFWg5IH1Oj+aZg2tDNOvVlaVT8tHXcbgSqmy2HA39wdD1dN+Ibb\nZg8VCNVpPbByaWmW6+UJgWwA4ARSnDESabx8S6KFAoGBAKfmejfjEkJVAKSlXtlS\nFDvZKOENGQNjZijAMCDCrefkmw0JtFgPe3pT4SqIWz5YL2LaV1eYlU0wB67DS2ZT\nmOeuVUWRZT22u+dSejJiHWeGY3CJewfgeM8vQfck3vS3/Dfdi1O6WjAbOMA0Rqa7\n9jIP6iDqZSSQl5nznW6/SYMg\n-----END PRIVATE KEY-----" | vercel env add FIREBASE_PRIVATE_KEY production

# Email Configuration
echo "mail.drawday.app" | vercel env add EMAIL_HOST production
echo "587" | vercel env add EMAIL_PORT production
echo "false" | vercel env add EMAIL_SECURE production
echo "admin@drawday.app" | vercel env add EMAIL_USER production
echo "Speed4Dayz1!" | vercel env add EMAIL_PASS production
echo "DrawDay Solutions <admin@drawday.app>" | vercel env add EMAIL_FROM production

# JWT Secret
echo "your-super-secret-jwt-key-change-this-in-production-2024" | vercel env add JWT_SECRET production

# Application URL - Update this to the production URL
echo "https://drawday-spinner.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo "All environment variables have been added to Vercel!"