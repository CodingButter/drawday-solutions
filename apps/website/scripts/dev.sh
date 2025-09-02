#!/bin/bash

echo "🔍 Ensuring port 3000 is free..."

# Use npx kill-port which is more reliable
npx kill-port 3000 2>/dev/null || true

# Small delay to ensure port is released
sleep 0.5

echo "🚀 Starting Next.js development server on port 3000..."

# Start the dev server on port 3000 using pnpm
exec pnpm exec next dev -p 3000