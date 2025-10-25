#!/bin/bash

# Smartify SIM - Status Script
# This script checks if the server and client are running

echo "📊 Smartify SIM Status"
echo "======================"
echo ""

# Check if server is running
if pgrep -f "tsx server/index.ts" > /dev/null; then
    echo "✅ Server: RUNNING"
    PID=$(pgrep -f "tsx server/index.ts")
    echo "   PID: $PID"
else
    echo "❌ Server: STOPPED"
fi

echo ""

# Check if port 5001 is in use
if netstat -tuln 2>/dev/null | grep -q ":5001 "; then
    echo "✅ Port 5001: IN USE"
else
    if ss -tuln 2>/dev/null | grep -q ":5001 "; then
        echo "✅ Port 5001: IN USE"
    else
        echo "❌ Port 5001: FREE"
    fi
fi

echo ""

# Test API endpoint
echo "🔍 Testing API endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/health 2>/dev/null | grep -q "200"; then
    echo "✅ API Health Check: OK"
else
    echo "❌ API Health Check: FAILED"
fi

echo ""
echo "📍 URLs:"
echo "   Backend API:  http://localhost:5001/api"
echo "   Frontend:     http://localhost:5001"
echo "   API Docs:     http://localhost:5001/api/docs"
echo ""
