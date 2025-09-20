#!/bin/bash

# Start Firebase emulators for local development
echo "Starting Firebase emulators..."

cd /home/codingbutter/drawday-solutions/project

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Start emulators
firebase emulators:start --only auth,firestore --project demo-project

echo "Firebase emulators started!"
echo "Auth Emulator: http://localhost:9099"
echo "Firestore Emulator: http://localhost:8080"
echo "Emulator UI: http://localhost:4000"