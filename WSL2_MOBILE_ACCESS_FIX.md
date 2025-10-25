# WSL2 Mobile Access Fix

## Problem

You're running the application in WSL2, but mobile devices can't access it using the WSL2 IP (`172.19.139.160`).

**Why?**
- `172.19.139.160` is WSL2's **internal** IP (Windows ↔️ WSL2 only)
- Mobile devices need your **Windows WiFi IP** (like `192.168.x.x`)

## Quick Fix (3 Steps)

### Step 1: Find Your Windows WiFi IP

**Option A: PowerShell Script (Recommended)**
```powershell
# In Windows PowerShell (not WSL)
cd C:\new_portfolio\smartify\SmartifySIM
.\get-windows-ip.ps1
```

**Option B: Manual Command**
```powershell
# In Windows PowerShell
ipconfig
```
Look for **"Wireless LAN adapter Wi-Fi"** → **IPv4 Address**
Example: `192.168.1.100`

### Step 2: Set Up Port Forwarding

**Run in Windows PowerShell AS ADMINISTRATOR:**
```powershell
cd C:\new_portfolio\smartify\SmartifySIM
.\setup-wsl-port-forwarding.ps1
```

This script will:
- Detect your WSL2 IP automatically
- Forward ports 5173, 5001, 5000 from Windows to WSL2
- Create firewall rules
- Show you the correct mobile URLs

**Manual Alternative:**
```powershell
# Get WSL2 IP
$wslIP = wsl hostname -I | ForEach-Object { $_.Trim() }

# Forward Vite dev server (port 5173)
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=$wslIP

# Forward backend (port 5001)
netsh interface portproxy add v4tov4 listenport=5001 listenaddress=0.0.0.0 connectport=5001 connectaddress=$wslIP

# Allow through firewall
New-NetFirewallRule -DisplayName "WSL2 Port 5173" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
New-NetFirewallRule -DisplayName "WSL2 Port 5001" -Direction Inbound -Protocol TCP -LocalPort 5001 -Action Allow
```

### Step 3: Access from Mobile

Use your **Windows WiFi IP** (not WSL2 IP):

**For Development (Vite):**
```
http://YOUR_WINDOWS_IP:5173/apply
```

**For Production/Backend:**
```
http://YOUR_WINDOWS_IP:5001/apply
```

**Example (if Windows IP is 192.168.1.100):**
```
http://192.168.1.100:5173/apply  ✅ This will work
http://172.19.139.160:5173/apply  ❌ This won't work from mobile
```

## How to Know It's Working

1. **On Desktop:** Visit `http://localhost:5173/`
2. **Check QR Code:** Should now show Windows IP (192.168.x.x)
3. **Scan QR Code:** Mobile should open the customer portal
4. **Verify:** Test the camera on Step 5 (Upload Documents)

## Port Forwarding Status

Check current port forwarding rules:
```powershell
netsh interface portproxy show v4tov4
```

You should see:
```
Listen Address   Port   Connect Address     Port
0.0.0.0          5173   172.19.139.160      5173
0.0.0.0          5001   172.19.139.160      5001
```

## Verify Firewall Rules

```powershell
Get-NetFirewallRule -DisplayName "*WSL*" | Select-Object DisplayName, Enabled
```

## Testing Checklist

- [ ] Windows PowerShell script run successfully
- [ ] Port forwarding rules created
- [ ] Firewall rules added
- [ ] Desktop can access: `http://localhost:5173/`
- [ ] Desktop can access: `http://YOUR_WINDOWS_IP:5173/`
- [ ] QR code shows Windows IP (not 172.x.x.x)
- [ ] Mobile can scan QR code
- [ ] Mobile can access customer portal
- [ ] Mobile camera works on Step 5

## Troubleshooting

### Mobile still can't connect

**1. Check same WiFi network**
```powershell
# On mobile: Settings → WiFi → Check network name
# On desktop: Windows → Settings → Network & Internet → WiFi
```
They must be identical.

**2. Check Windows Firewall**
```powershell
# Temporarily disable to test (re-enable after!)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Test mobile connection

# Re-enable firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

**3. Check port forwarding is active**
```powershell
netsh interface portproxy show v4tov4
```

If empty, re-run the setup script.

**4. Corporate/School WiFi**
Some networks block device-to-device communication (AP Isolation).
- Try a different WiFi network (home router, hotspot)
- Or use USB tethering from mobile to PC

### QR code shows no IP addresses

**Restart the dev server:**
```bash
# In WSL
npm run dev
```

**Check network detection:**
```bash
# In WSL
curl http://localhost:5001/api/network-info
```

Should return:
```json
{
  "ipv4": ["192.168.1.100"],
  "port": "5000",
  "isWSL": true,
  "windowsIP": "172.19.128.1"
}
```

### Port forwarding not working after Windows restart

Port forwarding rules persist, but might need to be refreshed:

```powershell
# Re-run the setup script
.\setup-wsl-port-forwarding.ps1
```

## Clean Up (Remove Port Forwarding)

When you're done testing:

```powershell
# Remove all port forwarding rules
netsh interface portproxy reset

# Remove firewall rules
Remove-NetFirewallRule -DisplayName "WSL2 Port 5173"
Remove-NetFirewallRule -DisplayName "WSL2 Port 5001"
```

## Why Use 5173 Instead of 5001?

- **Port 5173**: Vite dev server (frontend + backend together)
  - Hot reload for development
  - Use this for testing

- **Port 5001**: Backend only (production mode)
  - Static files served
  - Use after running `npm run build`

**For mobile testing during development, use port 5173.**

## Network Architecture

```
┌─────────────────────────────┐
│  Mobile Device              │
│  (192.168.1.50)            │
│                             │
│  Scans QR Code ────┐        │
└─────────────────────┼────────┘
                      │
                      │ Same WiFi Network
                      │
                      ▼
┌─────────────────────────────┐
│  Windows Host               │
│  WiFi IP: 192.168.1.100    │ ← Use this IP!
│                             │
│  Port Forwarding:           │
│  5173 → WSL2:5173          │
│  5001 → WSL2:5001          │
└─────────────────────────────┘
                      │
                      │ Internal Bridge
                      │
                      ▼
┌─────────────────────────────┐
│  WSL2 (Ubuntu)              │
│  Internal IP: 172.19.139.160│ ← Don't use this!
│                             │
│  Vite Dev Server: 5173     │
│  Backend API: 5001         │
└─────────────────────────────┘
```

## Quick Reference

| What | IP | Port | Works from Mobile? |
|------|----|----- |--------------------|
| WSL2 internal | 172.19.139.160 | 5173 | ❌ No |
| Windows localhost | localhost/127.0.0.1 | 5173 | ❌ No |
| Windows WiFi IP | 192.168.x.x | 5173 | ✅ Yes (with port forwarding) |
| Windows WiFi IP | 192.168.x.x | 5001 | ✅ Yes (with port forwarding) |

## Updated Files

The following files have been updated to detect and display the correct IP:

1. **Backend:** `server/routes.ts:363-436`
   - Auto-detects WSL2
   - Attempts to get Windows WiFi IP via PowerShell
   - Filters out WSL2 internal IPs (172.x.x.x)

2. **Frontend:** `client/src/pages/Home.tsx:73-105`
   - Shows warning if WSL2 detected
   - Displays setup instructions
   - Shows correct Windows IP in QR code

3. **Scripts:**
   - `get-windows-ip.ps1` - Find your Windows network IP
   - `setup-wsl-port-forwarding.ps1` - Automatic port forwarding setup

## Next Steps

1. ✅ Run `setup-wsl-port-forwarding.ps1` as Administrator
2. ✅ Get your Windows WiFi IP from the script output
3. ✅ Restart dev server: `npm run dev`
4. ✅ Check home page shows correct IP
5. ✅ Scan QR code from mobile
6. ✅ Test camera on Step 5
