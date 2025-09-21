#!/bin/bash

# Production Build Script
# Builds extension for production and deploys website to Vercel

set -e  # Exit on any error

echo "🚀 Starting Production Build & Deployment..."

echo "🧹 Cleaning previous builds..."
pnpm clean

echo "🏗️  Building packages..."
pnpm -r --filter='!@raffle-spinner/extension' --filter='!@raffle-spinner/website' build

echo "🌐 Building website for production..."
pnpm -w run build:website
echo "✅ Website build complete!"

echo "🎯 Building extension for production..."
VITE_WEBSITE_URL="https://www.drawday.app" VITE_ENV="production" pnpm --filter @raffle-spinner/extension build

echo "🚀 Deploying website to Vercel..."
if command -v vercel &> /dev/null; then
  vercel deploy --prod
  echo "✅ Website deployed to production!"
else
  echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
  echo "💡 Run: npm i -g vercel && vercel deploy --prod"
  echo "💡 Or deploy via GitHub integration"
fi

echo ""
echo "✅ Production build & deployment complete!"
echo "🎯 Extension ready for Chrome Web Store with production URLs"
echo "📦 Extension package: apps/extension/drawday-spinner-extension.zip"
echo "🌐 Website: https://www.drawday.app"