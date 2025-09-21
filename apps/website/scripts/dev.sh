#!/bin/bash

echo "🔍 Ensuring port 3000 is free..."

# Kill any process using port 3000 using system tools
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Small delay to ensure port is released
sleep 0.5

echo "🚀 Starting Next.js development server on port 3000..."

# Start the dev server on port 3000 using pnpm
exec pnpm exec next dev -p 3000