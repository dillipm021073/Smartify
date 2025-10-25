#!/bin/bash

# Smartify SIM - Stop Script
# This script stops both the backend server and frontend client

echo "🛑 Stopping Smartify SIM..."
echo ""

# Kill node and tsx processes
killall node 2>/dev/null
killall tsx 2>/dev/null

# Wait a moment
sleep 1

# Check if processes are stopped
if pgrep -f "tsx server/index.ts" > /dev/null; then
    echo "⚠️  Some processes may still be running"
    echo "Force kill with: killall -9 node tsx"
else
    echo "✅ All processes stopped successfully!"
fi

echo ""
