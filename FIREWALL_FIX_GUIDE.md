# 🔥 Windows Firewall Fix - Mobile Access Blocked

## Problem

**Your mobile device can't access the dev server even though:**
- ✓ You're on the same WiFi network
- ✓ You have the correct IP (192.168.1.6)
- ✓ Port forwarding is set up (WSL2)
- ✓ Dev server is running

**Cause:** Windows Firewall is blocking incoming connections from other devices on your network.

## 🚨 Common Symptoms

### On Mobile Browser:
```
This site can't be reached
192.168.1.6 took too long to respond
ERR_CONNECTION_TIMED_OUT
```

### On Desktop:
```
✓ http://localhost:5173/ works
✓ http://127.0.0.1:5173/ works
✗ http://192.168.1.6:5173/ times out
```

## ✅ Quick Fix (2 Options)

### Option 1: Automatic Fix (Recommended)

**Run in Windows PowerShell AS ADMINISTRATOR:**

```powershell
cd C:\new_portfolio\smartify\SmartifySIM
.\fix-windows-firewall.ps1
```

This will:
- ✓ Create firewall rules for ports 5173, 5001, 5000
- ✓ Enable rules for Domain, Private, and Public networks
- ✓ Allow inbound connections
- ✓ Show your mobile access URLs

### Option 2: Manual Firewall Configuration

#### Step 1: Open Windows Firewall
1. Press `Win + R`
2. Type: `wf.msc`
3. Press Enter

#### Step 2: Create Inbound Rule
1. Click **"Inbound Rules"** (left panel)
2. Click **"New Rule..."** (right panel)
3. Select **"Port"** → Next
4. Select **"TCP"**
5. Enter **"5173"** in "Specific local ports"
6. Click Next
7. Select **"Allow the connection"** → Next
8. Check **all three boxes**:
   - ✓ Domain
   - ✓ Private
   - ✓ Public
9. Click Next
10. Name: **"Smartify - Port 5173"**
11. Click Finish

#### Step 3: Repeat for Port 5001
Repeat Step 2 but use port **5001** instead.

## 🔍 Check Firewall Status

**Without Admin (just check status):**
```powershell
cd C:\new_portfolio\smartify\SmartifySIM
.\check-firewall-status.ps1
```

**Expected output:**
```
=== Windows Firewall Status Check ===

Firewall Profiles:
  Domain: ENABLED (Active)
  Private: ENABLED (Active)
  Public: ENABLED (Active)

Checking Smartify Firewall Rules:
  Smartify - Port 5173: ✓ Enabled
  Smartify - Port 5001: ✓ Enabled
  Smartify - Port 5000: ✓ Enabled

Your Network IP Address:
  IP: 192.168.1.6
  Adapter: Wi-Fi

Mobile URL: http://192.168.1.6:5173/apply

Port Forwarding Status (WSL2):
  ✓ Port 5173 forwarding active
  ✓ Port 5001 forwarding active

=== Summary ===
✓ Everything looks good!
```

## 🧪 Test Firewall

### Step 1: Test from Desktop First

Open your **desktop browser** and navigate to:
```
http://192.168.1.6:5173/
```

**If this works:** Firewall is configured correctly
**If this fails:** Firewall is still blocking

### Step 2: Test from Mobile

Open your **mobile browser** and navigate to:
```
http://192.168.1.6:5173/apply
```

**If this works:** Success! 🎉
**If this fails:** See troubleshooting below

## 🛠️ Troubleshooting

### Firewall Still Blocking?

#### Quick Test: Temporarily Disable Firewall

**PowerShell (Admin):**
```powershell
# Disable Private profile (most home WiFi)
Set-NetFirewallProfile -Profile Private -Enabled False
```

**Test mobile access now**

If it works, the issue is definitely firewall rules.

**Re-enable firewall immediately:**
```powershell
Set-NetFirewallProfile -Profile Private -Enabled True
```

Then run `fix-windows-firewall.ps1` to create proper rules.

### Check Which Firewall Profile is Active

```powershell
Get-NetConnectionProfile
```

Look at **"NetworkCategory"**:
- **Private**: Home/Work networks (most common)
- **Public**: Public WiFi, airports, cafes
- **Domain**: Corporate domain networks

Your firewall rules must match the active profile.

### Verify Rules Were Created

```powershell
Get-NetFirewallRule -DisplayName "Smartify*" | Select-Object DisplayName, Enabled, Direction
```

Should show:
```
DisplayName           Enabled Direction
-----------           ------- ---------
Smartify - Port 5173  True    Inbound
Smartify - Port 5001  True    Inbound
Smartify - Port 5000  True    Inbound
```

### Remove and Recreate Rules

If rules exist but still not working:

```powershell
# Remove old rules
Remove-NetFirewallRule -DisplayName "Smartify*"
Remove-NetFirewallRule -DisplayName "WSL*"

# Run fix script again
.\fix-windows-firewall.ps1
```

### Third-Party Firewalls

If you have third-party security software:
- **Norton, McAfee, Avast, Kaspersky, etc.**
- They have their own firewalls
- Windows Firewall rules won't help

**Solutions:**
1. Temporarily disable third-party firewall to test
2. Add rules in the third-party software
3. Or uninstall and use Windows Defender

### Corporate/Work Laptop?

Corporate policies might:
- Override your firewall rules
- Block all incoming connections
- Prevent you from making changes

**Workaround:** Use a personal computer or different network.

## 📋 Complete Setup Checklist

Run these in order:

### 1. Check Current Status
```powershell
# No admin needed
.\check-firewall-status.ps1
```

### 2. Fix Firewall (if needed)
```powershell
# Run as Administrator
.\fix-windows-firewall.ps1
```

### 3. Set Up Port Forwarding (WSL2 only)
```powershell
# Run as Administrator
.\setup-wsl-port-forwarding.ps1
```

### 4. Start Dev Server
```bash
# In WSL
npm run dev
```

### 5. Test Desktop Access
```
http://localhost:5173/          ✓ Should work
http://192.168.1.6:5173/        ✓ Should work (if firewall open)
```

### 6. Test Mobile Access
```
http://192.168.1.6:5173/apply   ✓ Should work
```

## 🎯 What Each Port Does

| Port | Purpose | Required For |
|------|---------|--------------|
| 5173 | Vite dev server (Frontend + API proxy) | Mobile testing |
| 5001 | Backend API (production mode) | Production/API testing |
| 5000 | Backend API (alternative) | Fallback |

**For development, you only need port 5173.**

## 🔐 Security Notes

### Is It Safe to Open These Ports?

**On Home WiFi:** ✅ Generally safe
- Only your local network can access
- Not exposed to the internet
- Only while dev server is running

**On Public WiFi:** ⚠️ Use caution
- Other devices on network can access
- Could expose sensitive data
- Only for testing, disable when done

### Closing Ports After Testing

**Disable firewall rules:**
```powershell
Disable-NetFirewallRule -DisplayName "Smartify*"
```

**Re-enable later:**
```powershell
Enable-NetFirewallRule -DisplayName "Smartify*"
```

**Completely remove:**
```powershell
Remove-NetFirewallRule -DisplayName "Smartify*"
```

## 📱 Mobile Access Flow

```
Mobile Device (192.168.1.50)
          ↓
  http://192.168.1.6:5173/apply
          ↓
    [Home WiFi Router]
          ↓
Windows PC (192.168.1.6)
          ↓
    [Windows Firewall] ← Must allow port 5173
          ↓
    [Port Forwarding] ← WSL2: 5173 → 172.19.139.160:5173
          ↓
  WSL2 (172.19.139.160)
          ↓
  Vite Dev Server :5173
          ↓
    Application Response
```

## 🚦 Status Check Commands

### Quick Status
```powershell
# Firewall enabled?
Get-NetFirewallProfile | Select-Object Name, Enabled

# Rules exist?
Get-NetFirewallRule -DisplayName "Smartify*"

# Port forwarding active?
netsh interface portproxy show v4tov4

# Network IP?
ipconfig | findstr "IPv4"
```

### Full Diagnostic
```powershell
.\check-firewall-status.ps1
```

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Desktop can access: `http://192.168.1.6:5173/`
2. ✅ Mobile can access: `http://192.168.1.6:5173/apply`
3. ✅ QR code scanning works
4. ✅ Customer portal loads on mobile
5. ✅ Camera activates on Step 5

## 🆘 Still Not Working?

### Check Everything:

```powershell
# 1. Firewall rules
Get-NetFirewallRule -DisplayName "Smartify*"

# 2. Port forwarding (WSL2)
netsh interface portproxy show v4tov4

# 3. Network IP
ipconfig

# 4. Same WiFi?
Get-NetConnectionProfile

# 5. Dev server running?
# In WSL: curl http://localhost:5173/
```

### Common Issues:

1. **Admin rights**: Must run scripts as Administrator
2. **Third-party firewall**: Windows rules won't apply
3. **VPN active**: Can change routing/firewall behavior
4. **Different WiFi network**: Mobile and desktop must be on same network
5. **ISP/Router blocking**: Some routers block device-to-device (AP Isolation)

## 📞 Quick Help

**Desktop works, mobile doesn't:**
→ Firewall issue (run `fix-windows-firewall.ps1`)

**Both desktop and mobile fail on IP address:**
→ Port forwarding issue (run `setup-wsl-port-forwarding.ps1`)

**Only localhost works:**
→ Both firewall AND port forwarding needed

**Nothing works:**
→ Dev server not running (`npm run dev`)

## 📝 Script Reference

| Script | Purpose | Needs Admin? |
|--------|---------|--------------|
| `check-firewall-status.ps1` | Check current configuration | No |
| `fix-windows-firewall.ps1` | Create/fix firewall rules | Yes |
| `setup-wsl-port-forwarding.ps1` | Port forwarding + firewall | Yes |
| `get-windows-ip.ps1` | Get your network IP | No |

---

**Run this now:**
```powershell
cd C:\new_portfolio\smartify\SmartifySIM
.\fix-windows-firewall.ps1
```

Then test: `http://192.168.1.6:5173/apply` on mobile! 🎉
