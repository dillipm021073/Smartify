# 📱 Mobile Access Setup - Complete Guide

## 🎯 Your Question: Is Windows Firewall Blocking Mobile Access?

**YES!** Windows Firewall is almost certainly blocking incoming connections from your mobile device. This is the #1 reason mobile can't access dev servers even with correct setup.

## ✅ Complete Solution (3 Steps)

### Step 1: Fix Windows Firewall

**Run in Windows PowerShell AS ADMINISTRATOR:**

```powershell
cd C:\new_portfolio\smartify\SmartifySIM
.\fix-windows-firewall.ps1
```

**What it does:**
- ✓ Creates firewall rules for ports 5173, 5001, 5000
- ✓ Allows incoming connections from your WiFi network
- ✓ Works on Private, Public, and Domain networks
- ✓ Shows your mobile access URLs

### Step 2: Set Up Port Forwarding (WSL2)

**Run in Windows PowerShell AS ADMINISTRATOR:**

```powershell
.\setup-wsl-port-forwarding.ps1
```

**What it does:**
- ✓ Forwards Windows ports to WSL2
- ✓ Creates firewall rules automatically
- ✓ Detects your network IP
- ✓ Shows mobile URLs

### Step 3: Start Dev Server

**In WSL:**

```bash
npm run dev
```

## 🔍 Quick Status Check

**Want to check if everything is configured correctly?**

```powershell
# No admin needed
.\check-firewall-status.ps1
```

**Expected output:**
```
✓ Firewall rules enabled
✓ Port forwarding active
✓ Network IP: 192.168.1.6
Mobile URL: http://192.168.1.6:5173/apply
```

## 📱 Access from Mobile

### Option 1: Scan QR Code

1. Open desktop browser: `http://localhost:5173/`
2. QR code will be displayed
3. Scan with mobile camera
4. Customer portal opens automatically

### Option 2: Type URL Manually

On your mobile browser:
```
http://192.168.1.6:5173/apply
```

**✅ Make sure mobile is on the same WiFi network!**

## 🧪 Test It Works

### Test 1: Desktop First

```
http://192.168.1.6:5173/
```

**Should work:** Page loads normally
**If fails:** Firewall or port forwarding issue

### Test 2: Mobile Access

```
http://192.168.1.6:5173/apply
```

**Should work:** Customer portal loads
**If fails:** Check firewall and same WiFi network

### Test 3: Mobile Camera

1. Navigate to Step 5 (Upload Documents)
2. Click **"Take Photo"**
3. Camera should activate
4. Take a photo
5. Preview appears

## 🚨 Troubleshooting

### Mobile Can't Connect

**Most common causes (in order):**

#### 1. Windows Firewall Blocking (95% of cases)

**Check:**
```powershell
.\check-firewall-status.ps1
```

**Fix:**
```powershell
.\fix-windows-firewall.ps1
```

#### 2. Different WiFi Networks

**Check:**
- Desktop WiFi: Settings → Network & Internet → WiFi
- Mobile WiFi: Settings → WiFi

**Must be identical network name!**

#### 3. Port Forwarding Not Set Up (WSL2)

**Check:**
```powershell
netsh interface portproxy show v4tov4
```

**Should show:**
```
Listen on 0.0.0.0:5173  Connect to 172.19.139.160:5173
```

**Fix:**
```powershell
.\setup-wsl-port-forwarding.ps1
```

#### 4. Dev Server Not Running

**Check:**
```bash
# In WSL
curl http://localhost:5173/
```

**Start server:**
```bash
npm run dev
```

### Quick Test: Disable Firewall Temporarily

**ONLY FOR TESTING:**

```powershell
# Disable (test if firewall is the issue)
Set-NetFirewallProfile -Profile Private -Enabled False

# Test mobile access now

# Re-enable immediately!
Set-NetFirewallProfile -Profile Private -Enabled True
```

If mobile works when firewall is disabled, run `fix-windows-firewall.ps1` to create proper rules.

## 📋 Complete Setup Checklist

Run these in order:

- [ ] **Step 1:** Check status
  ```powershell
  .\check-firewall-status.ps1
  ```

- [ ] **Step 2:** Fix firewall (as Admin)
  ```powershell
  .\fix-windows-firewall.ps1
  ```

- [ ] **Step 3:** Setup port forwarding (as Admin, WSL2 only)
  ```powershell
  .\setup-wsl-port-forwarding.ps1
  ```

- [ ] **Step 4:** Start dev server
  ```bash
  npm run dev
  ```

- [ ] **Step 5:** Test desktop access
  ```
  http://192.168.1.6:5173/
  ```

- [ ] **Step 6:** Test mobile access
  ```
  http://192.168.1.6:5173/apply
  ```

- [ ] **Step 7:** Test camera on mobile (Step 5)

## 🔧 Scripts Reference

| Script | Purpose | Admin? | When to Use |
|--------|---------|--------|-------------|
| `check-firewall-status.ps1` | Check configuration | No | Anytime - just checking |
| `fix-windows-firewall.ps1` | Create firewall rules | **Yes** | Mobile can't connect |
| `setup-wsl-port-forwarding.ps1` | Port forwarding + firewall | **Yes** | First time setup (WSL2) |
| `get-windows-ip.ps1` | Show network IP | No | Find IP for mobile |

## 📊 Network Flow

```
┌──────────────────────────────────────────────────┐
│ Mobile Device (192.168.1.50)                     │
│                                                  │
│ Scans QR Code or types:                         │
│ http://192.168.1.6:5173/apply                   │
└──────────────────┬───────────────────────────────┘
                   │
        Same WiFi Network (192.168.1.x)
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Windows PC (192.168.1.6)                         │
│                                                  │
│ ┌──────────────────────────────────────┐        │
│ │ Windows Firewall                     │        │
│ │ ✓ Port 5173: Allow                  │ ← FIX THIS!
│ │ ✓ Port 5001: Allow                  │        │
│ └──────────────────────────────────────┘        │
│                   │                              │
│ ┌──────────────────────────────────────┐        │
│ │ Port Forwarding (WSL2)               │        │
│ │ 5173 → 172.19.139.160:5173          │        │
│ └──────────────────────────────────────┘        │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ WSL2 Ubuntu (172.19.139.160)                    │
│                                                  │
│ Vite Dev Server :5173                           │
│ Backend API :5001                               │
└──────────────────────────────────────────────────┘
```

## 🎯 Your Configuration

Based on detection:

- **Windows WiFi IP:** `192.168.1.6`
- **WSL2 IP:** `172.19.139.160`
- **Vite Port:** `5173`
- **Backend Port:** `5001`

**Mobile Access URL:**
```
http://192.168.1.6:5173/apply
```

## 🔐 Security Notes

### Is This Safe?

**On Home WiFi:** ✅ Yes
- Only devices on your local network can access
- Not exposed to the internet
- Firewall rules only allow specific ports
- Only active when dev server is running

**On Public WiFi:** ⚠️ Be Careful
- Other people on the network can access
- Don't use with sensitive data
- Disable firewall rules when done

### Disable After Testing

```powershell
# Disable rules (keeps them for later)
Disable-NetFirewallRule -DisplayName "Smartify*"

# Re-enable when needed
Enable-NetFirewallRule -DisplayName "Smartify*"

# Or completely remove
Remove-NetFirewallRule -DisplayName "Smartify*"
```

## 📝 All Documentation Files

1. **FIREWALL_FIX_GUIDE.md** - Detailed firewall troubleshooting
2. **WSL2_MOBILE_ACCESS_FIX.md** - WSL2 port forwarding guide
3. **MOBILE_ACCESS_READY.md** - Network detection and setup
4. **MOBILE_QR_ACCESS_GUIDE.md** - QR code feature documentation
5. **MOBILE_SETUP_COMPLETE.md** - This file (complete overview)

## ✅ Final Checklist

Before testing, ensure:

- [x] Firewall rules created
- [x] Port forwarding configured (WSL2)
- [x] Dev server running
- [x] Mobile on same WiFi
- [x] Using Windows IP (192.168.1.6), not WSL2 IP (172.x.x.x)
- [x] Using port 5173 (not 5001 unless testing backend directly)

## 🎉 Success!

You'll know everything is working when:

1. ✅ Desktop: `http://192.168.1.6:5173/` loads
2. ✅ Mobile: `http://192.168.1.6:5173/apply` loads
3. ✅ QR code scannable
4. ✅ Customer portal accessible on mobile
5. ✅ Camera activates on Step 5 (Upload Documents)
6. ✅ Photo capture and preview works

---

## 🚀 Quick Start (TL;DR)

**If mobile can't access:**

```powershell
# In Windows PowerShell AS ADMINISTRATOR
cd C:\new_portfolio\smartify\SmartifySIM

# Fix firewall (REQUIRED)
.\fix-windows-firewall.ps1

# Setup port forwarding (WSL2 only)
.\setup-wsl-port-forwarding.ps1
```

```bash
# In WSL
npm run dev
```

**Then on mobile:**
```
http://192.168.1.6:5173/apply
```

**That's it!** 🎉

---

**Answer to your question:**
**YES, Windows Firewall is blocking mobile access. Run `fix-windows-firewall.ps1` to fix it!**
