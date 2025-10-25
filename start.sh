#!/bin/bash

# Smartify SIM - Start Script
# This script starts both the backend server and frontend client

echo "🚀 Starting Smartify SIM..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
killall node 2>/dev/null
killall tsx 2>/dev/null
sleep 2

# Start the dev server (handles both frontend and backend)
echo "▶️  Starting server and client..."
npm run dev > /tmp/smartify.log 2>&1 &

# Wait a bit for server to start
sleep 3

# Check if server started successfully
if pgrep -f "tsx server/index.ts" > /dev/null; then
    echo "✅ Server started successfully!"
    echo ""
    echo "📍 Backend API:  http://localhost:5001/api"
    echo "🌐 Frontend:     http://localhost:5001"
    echo "📚 API Docs:     http://localhost:5001/api/docs"
    echo ""
    echo "📝 Logs: tail -f /tmp/smartify.log"
    echo "🛑 Stop: ./stop.sh"
    echo ""
else
    echo "❌ Failed to start server!"
    echo "Check logs: cat /tmp/smartify.log"
    exit 1
fi
