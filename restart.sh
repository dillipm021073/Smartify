#!/bin/bash

# Smartify SIM - Restart Script
# This script restarts both the backend server and frontend client

echo "🔄 Restarting Smartify SIM..."
echo ""

# Stop first
./stop.sh

# Wait a moment
sleep 2

# Start
./start.sh
