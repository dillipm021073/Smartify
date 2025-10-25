# Mobile QR Code Access Guide

## Overview
The home page now displays a QR code that mobile users can scan to directly access the customer portal. This feature enables seamless WiFi-based mobile access for testing and demonstration.

## Features Added

### 1. Backend Network Detection
- **Endpoint**: `GET /api/network-info`
- **Location**: `server/routes.ts:363-391`
- Returns all IPv4 network addresses of the server
- Excludes localhost/internal addresses

### 2. Frontend QR Code Display
- **Component**: `Home.tsx`
- **Dependencies**: `qrcode.react` library
- Displays QR code with customer portal URL
- Shows all available network addresses
- Auto-refreshes network info every 10 seconds

### 3. Vite Dev Server Configuration
- **File**: `vite.config.ts:34-41`
- Configured to listen on `0.0.0.0` (all network interfaces)
- Port: 5173

## How to Use

### Step 1: Start the Development Server

```bash
npm run dev
```

The server should start and display:
```
➜  Local:   http://localhost:5173/
➜  Network: http://0.0.0.0:5173/
```

### Step 2: Find Your Network IP Address

#### On Windows (Host Machine):
Open PowerShell or Command Prompt:
```cmd
ipconfig
```

Look for your **WiFi adapter's IPv4 Address** (e.g., `192.168.1.100`)

#### On WSL2:
The server will automatically detect your network interfaces and display them on the home page.

### Step 3: Access the Home Page

On your **desktop browser**, navigate to:
```
http://localhost:5173/
```

You should see:
- The regular home page
- A new section titled **"Scan to Apply on Mobile"**
- A QR code in the center
- List of available network addresses below

### Step 4: Scan from Mobile

1. **Ensure mobile is on the same WiFi network** as your development machine
2. Open your mobile camera app
3. Point it at the QR code on the screen
4. Tap the notification that appears
5. Your mobile browser will open the customer portal at `/apply`

### Step 5: Test Mobile Features

Once on mobile, test:
- ✅ Responsive layout
- ✅ Touch interactions
- ✅ **Camera access** for document upload (Step 5)
- ✅ Form inputs and selections
- ✅ Navigation between steps

## Troubleshooting

### QR Code Not Displaying
- Check browser console for errors
- Verify `qrcode.react` is installed: `npm list qrcode.react`
- Check network info endpoint: `http://localhost:5173/api/network-info`

### Mobile Can't Connect

#### 1. Check Same WiFi Network
- Desktop and mobile must be on the **same WiFi network**
- Corporate/school networks may block device-to-device communication

#### 2. Windows Firewall
If connection fails, allow port 5173:

**Option A: PowerShell (Admin)**
```powershell
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
```

**Option B: GUI**
1. Open **Windows Defender Firewall** → Advanced Settings
2. **Inbound Rules** → **New Rule**
3. Rule Type: **Port**
4. Protocol: **TCP**, Port: **5173**
5. Action: **Allow the connection**
6. Profile: **All** (Domain, Private, Public)
7. Name: **Vite Dev Server**

#### 3. WSL2 Port Forwarding
WSL2 sometimes needs manual port forwarding:

**PowerShell (Admin)**
```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.x.x.x
```
Replace `172.x.x.x` with your WSL IP (get it with `hostname -I` in WSL)

#### 4. Network IP Not Detected
If the home page shows no network addresses:
- Backend endpoint may not be running
- Check: `curl http://localhost:5000/api/network-info`
- Restart dev server

### QR Code Shows Localhost
If QR code shows `localhost` instead of network IP:
- Network detection endpoint may have failed
- Manually type the URL on mobile: `http://YOUR_IP:5173/apply`

## Manual Mobile Access

If QR code doesn't work, manually enter on mobile browser:
```
http://YOUR_NETWORK_IP:5173/apply
```

Example:
```
http://192.168.1.100:5173/apply
```

## Network Addresses Explained

The home page displays all detected network addresses:

- **192.168.x.x**: Home/private network (most common)
- **10.x.x.x**: Private network (corporate/VPN)
- **172.16-31.x.x**: Private network

Choose the address that matches your WiFi network's range.

## Testing Camera on Mobile

When you reach **Step 5 (Upload Documents)** on mobile:

1. Click **"Take Photo"** button
2. Mobile browser will request camera permission
3. Grant permission
4. Camera app launches (rear camera)
5. Take photo of a document
6. Photo appears in the upload preview

**Supported browsers:**
- ✅ iOS Safari (iOS 11+)
- ✅ Android Chrome
- ✅ Android Firefox

## Architecture

```
┌─────────────────┐
│  Desktop PC     │
│  (Development)  │
│                 │
│  Browser        │──── http://localhost:5173/ ───┐
│  QR Code        │                                │
└─────────────────┘                                │
                                                   │
        ┌──────────────────────────────────────────┘
        │ Same WiFi Network
        │
        ▼
┌─────────────────┐
│  Mobile Phone   │
│                 │
│  Camera ────► QR Code
│  Browser ────► http://192.168.1.100:5173/apply
│                 │
│  Camera Access  │──► Document Upload
└─────────────────┘
```

## Code References

### Backend
- Network Info Endpoint: `server/routes.ts:363-391`
- Network Info API Hook: `client/src/lib/api.ts:100-114`

### Frontend
- Home Page with QR: `client/src/pages/Home.tsx:56-117`
- Vite Config: `vite.config.ts:34-41`

### Document Upload
- Camera Input: `client/src/components/DocumentUpload.tsx:117-124`
- Usage: `client/src/pages/CustomerPortal.tsx:493-505`

## Production Deployment

For production, you'll need to:

1. **Use proper domain name** instead of IP address
2. **HTTPS/SSL certificate** (required for camera access on HTTPS sites)
3. **Update CORS settings** if frontend/backend are on different domains
4. **Remove or secure** the network info endpoint (security consideration)

## Security Notes

⚠️ **Development Only**
- The `/api/network-info` endpoint exposes server network information
- Only enable this in development environments
- For production, use fixed URLs or environment variables

## Next Steps

1. Test on various mobile devices (iOS and Android)
2. Test camera functionality on mobile
3. Verify responsive design at different screen sizes
4. Test form validation on mobile
5. Check mobile performance and load times
