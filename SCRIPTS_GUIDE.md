# Server Management Scripts

Simple scripts to manage the Smartify SIM application.

---

## Available Scripts

### 🚀 Start Server
```bash
./start.sh
```
- Stops any existing processes
- Starts both backend server and frontend client
- Runs in background
- Logs to `/tmp/smartify.log`

**Output:**
```
🚀 Starting Smartify SIM...
🧹 Cleaning up existing processes...
▶️  Starting server and client...
✅ Server started successfully!

📍 Backend API:  http://localhost:5001/api
🌐 Frontend:     http://localhost:5001
📚 API Docs:     http://localhost:5001/api/docs
```

---

### 🛑 Stop Server
```bash
./stop.sh
```
- Stops all node and tsx processes
- Cleans up gracefully

**Output:**
```
🛑 Stopping Smartify SIM...
✅ All processes stopped successfully!
```

---

### 🔄 Restart Server
```bash
./restart.sh
```
- Stops server
- Waits 2 seconds
- Starts server again

**Use when:** Code changes aren't hot-reloading properly

---

### 📊 Check Status
```bash
./status.sh
```
- Shows if server is running
- Shows process ID (PID)
- Checks if port 5001 is in use
- Tests API health endpoint

**Output:**
```
📊 Smartify SIM Status
======================

✅ Server: RUNNING
   PID: 12345

✅ Port 5001: IN USE

🔍 Testing API endpoint...
✅ API Health Check: OK

📍 URLs:
   Backend API:  http://localhost:5001/api
   Frontend:     http://localhost:5001
   API Docs:     http://localhost:5001/api/docs
```

---

## Common Tasks

### Start for First Time
```bash
npm install        # Install dependencies (one time)
./start.sh         # Start server
```

### Daily Development
```bash
./start.sh         # Start working
# ... make changes ...
# Hot reload happens automatically
./stop.sh          # Done for the day
```

### Troubleshooting

**Server won't start?**
```bash
./stop.sh          # Force stop everything
./start.sh         # Try starting again
```

**Check if it's running:**
```bash
./status.sh        # See current status
```

**View logs:**
```bash
tail -f /tmp/smartify.log
```

**Port already in use?**
```bash
./stop.sh          # This will free port 5001
```

---

## What Each Script Does

### start.sh
1. Kills any existing node/tsx processes
2. Waits 2 seconds
3. Runs `npm run dev` in background
4. Logs output to `/tmp/smartify.log`
5. Waits 3 seconds for startup
6. Checks if server started successfully
7. Displays URLs

### stop.sh
1. Kills all node processes
2. Kills all tsx processes
3. Waits 1 second
4. Confirms processes are stopped

### restart.sh
1. Calls `./stop.sh`
2. Waits 2 seconds
3. Calls `./start.sh`

### status.sh
1. Checks if tsx server process is running
2. Shows process ID
3. Checks if port 5001 is in use
4. Tests API health endpoint
5. Displays all URLs

---

## Environment

**Development:**
- Backend: http://localhost:5001/api
- Frontend: http://localhost:5001
- Database: PostgreSQL at localhost:5432/smartify
- Dev Mode: OTP is always `123456`

**Log File:**
- Location: `/tmp/smartify.log`
- View: `tail -f /tmp/smartify.log`
- Clear: `> /tmp/smartify.log`

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./start.sh` | Start everything |
| `./stop.sh` | Stop everything |
| `./restart.sh` | Restart everything |
| `./status.sh` | Check if running |
| `tail -f /tmp/smartify.log` | View logs |
| `npm run dev` | Manual start (foreground) |

---

## Notes

- Scripts are safe to run multiple times
- `start.sh` always cleans up first before starting
- All scripts work from the project root directory
- Logs are preserved in `/tmp/smartify.log`
- Scripts use `killall` which stops ALL node processes (be careful if running other Node apps)

---

## Windows Users (WSL)

These scripts work in WSL (Windows Subsystem for Linux).

**From Windows Command Prompt/PowerShell:**
```bash
wsl ./start.sh
wsl ./stop.sh
wsl ./status.sh
```

**Or enter WSL first:**
```bash
wsl
cd /mnt/c/new_portfolio/smartify/SmartifySIM
./start.sh
```

---

## Alternative: Manual Start

If scripts don't work for some reason:

```bash
# Start (foreground)
npm run dev

# Stop
Press Ctrl+C

# Start (background)
npm run dev &

# Stop (background)
killall node tsx
```

---

Happy coding! 🚀
