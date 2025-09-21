#!/bin/bash

# Development Build Script
# Builds extension for local development (uses localhost:3000)

set -e  # Exit on any error

echo "🔧 Starting Development Build..."

echo "🏗️  Building packages..."
pnpm -r --filter='!@raffle-spinner/extension' --filter='!@raffle-spinner/website' build

echo "🎯 Building extension for development..."
VITE_WEBSITE_URL="http://localhost:3000" VITE_ENV="development" pnpm --filter @raffle-spinner/extension build

echo "✅ Development build complete!"
echo "🎯 Extension ready for local development with localhost:3000"
echo "📦 Extension package: apps/extension/drawday-spinner-extension.zip"
echo "💡 Remember to start the website with: pnpm --filter @raffle-spinner/website dev"