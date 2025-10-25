# 📱 Smartify - End User URLs

## ✅ Backend API - RUNNING NOW!

The backend server is **live and operational** at:

---

## 🖥️ Desktop/Laptop Access

### API Base URL
```
http://localhost:3001/api/v1
```

### Interactive API Documentation (Swagger)
```
http://localhost:3001/api/docs
```
👉 **Open this in your browser to see all available endpoints and test them!**

---

## 📱 Mobile/Tablet Access (Same WiFi Network)

### Step 1: Find Your Computer's IP Address

**On Windows (PowerShell or CMD):**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.0.x.x)

**Example output:**
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### Step 2: Access from Mobile Device

Replace `YOUR_IP` with your actual IP address from Step 1:

**API Base URL:**
```
http://YOUR_IP:3001/api/v1
```

**Example (if your IP is 192.168.1.100):**
```
http://192.168.1.100:3001/api/v1
```

**API Documentation:**
```
http://YOUR_IP:3001/api/docs
```

---

## 🎯 Customer Portal URLs (Frontend - When Built)

### Desktop
```
http://localhost:3000
```

### Mobile (Same WiFi)
```
http://YOUR_IP:3000
```

**Customer Flow Pages:**
1. `/` - OTP Verification (Step 1)
2. `/application/documents` - Document Upload (Step 2)
3. `/application/address` - Address Form (Step 3)
4. `/application/employment` - Employment Info (Step 4)
5. `/application/store` - Store Assignment (Step 5)
6. `/application/review` - Review Application (Step 6)
7. `/application/signature` - Sign & Submit (Step 7)
8. `/application/confirmation` - Confirmation Screen

---

## 👤 Agent Portal URLs (Frontend - When Built)

### Desktop
```
http://localhost:3000/agent/login
```

### Mobile (Same WiFi)
```
http://YOUR_IP:3000/agent/login
```

**Agent Pages:**
- `/agent/login` - Agent Login
- `/agent/dashboard` - Agent Dashboard
- `/agent/search` - Search Applications
- `/agent/applications/:id` - Review Application

---

## 🧪 Test the Backend RIGHT NOW

### Method 1: Using Browser
Open your browser and go to:
```
http://localhost:3001/api/docs
```

You can test all endpoints directly from the Swagger interface!

### Method 2: Using curl (Command Line)

**Get all plans:**
```bash
curl http://localhost:3001/api/v1/products/plans
```

**Get all devices:**
```bash
curl http://localhost:3001/api/v1/products/devices
```

**Get provinces:**
```bash
curl http://localhost:3001/api/v1/locations/provinces
```

**Agent Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/agent/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Customer - Send OTP:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com"}'
```

**Customer - Verify OTP:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","otpCode":"123456"}'
```

---

## 📋 Complete API Endpoint Reference

### Authentication
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/send-otp` | Send OTP to email | ✅ Yes |
| POST | `/api/v1/auth/verify-otp` | Verify OTP code | ✅ Yes |
| POST | `/api/v1/auth/agent/login` | Agent login | ✅ Yes |

### Applications (Customer)
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| POST | `/api/v1/applications` | Create application | ✅ Yes |
| GET | `/api/v1/applications/:id` | Get by ID | ✅ Yes |
| GET | `/api/v1/applications/cart/:cartId` | Get by Cart ID | ✅ Yes |
| PUT | `/api/v1/applications/:id/customer-info` | Update ID documents | ✅ Yes |
| PUT | `/api/v1/applications/:id/address` | Update address | ✅ Yes |
| PUT | `/api/v1/applications/:id/employment` | Update employment | ✅ Yes |
| PUT | `/api/v1/applications/:id/privacy` | Update privacy | ✅ Yes |
| POST | `/api/v1/applications/:id/submit` | Submit application | ✅ Yes |

### Applications (Agent - Requires Auth)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/applications` | List all applications | 🔒 Yes |
| GET | `/api/v1/applications/search/by-national-id/:id` | Search by National ID | 🔒 Yes |
| PATCH | `/api/v1/applications/:id/status` | Update status | 🔒 Yes |

### Products
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| GET | `/api/v1/products/plans` | Get all plans | ✅ Yes |
| GET | `/api/v1/products/plans/:id` | Get plan details | ✅ Yes |
| GET | `/api/v1/products/devices` | Get all devices | ✅ Yes |
| GET | `/api/v1/products/devices/:id` | Get device details | ✅ Yes |
| GET | `/api/v1/products/devices/:id/configurations` | Get configurations | ✅ Yes |
| GET | `/api/v1/products/stores` | Get all stores | ✅ Yes |

### Locations
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| GET | `/api/v1/locations/provinces` | Get provinces | ✅ Yes |
| GET | `/api/v1/locations/provinces/:id/cities` | Get cities | ✅ Yes |
| GET | `/api/v1/locations/cities/:id/barangays` | Get barangays | ✅ Yes |
| GET | `/api/v1/locations/barangays/:id/zipcode` | Get zip code | ✅ Yes |

### File Upload
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| POST | `/api/v1/upload/document` | Upload single document | ✅ Yes |
| POST | `/api/v1/upload/documents` | Upload multiple documents | ✅ Yes |
| POST | `/api/v1/upload/signature` | Upload signature | ✅ Yes |

---

## 🔑 Test Credentials

### Agent Login
```
Username: admin
Password: admin123
```

OR

```
Username: agent1
Password: admin123
```

### Customer OTP (Development Mode)
```
Email: any-email@example.com
OTP Code: 123456
```

---

## 🌐 Accessing from Mobile Device - Step by Step

### For iPhone/iPad:

1. **Connect to Same WiFi** as your computer
2. **Find your computer's IP:**
   - On Windows: Open CMD and type `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

3. **Open Safari on iPhone/iPad:**
   ```
   http://192.168.1.100:3001/api/docs
   ```

4. **Add to Home Screen (Optional):**
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Now you have an app-like icon!

### For Android Phone/Tablet:

1. **Connect to Same WiFi** as your computer
2. **Find your computer's IP** (same as above)
3. **Open Chrome on Android:**
   ```
   http://192.168.1.100:3001/api/docs
   ```

4. **Install as App (Optional):**
   - Tap the three dots menu
   - Tap "Add to Home screen"
   - Now you have an app-like icon!

---

## ⚠️ Important Notes

### Port Forwarding for WSL (Windows)
Since you're using WSL (Windows Subsystem for Linux), you might need to set up port forwarding:

**In PowerShell (Run as Administrator):**
```powershell
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=172.19.139.160
```

Replace `172.19.139.160` with your WSL IP address.

**To check current port forwarding:**
```powershell
netsh interface portproxy show v4tov4
```

**To remove port forwarding:**
```powershell
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0
```

### Firewall
Make sure Windows Firewall allows connections on port 3001:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules"
4. Click "New Rule"
5. Select "Port" → Next
6. Enter port 3001 → Next
7. Allow the connection → Next
8. Apply to all profiles → Next
9. Name it "Smartify Backend" → Finish

---

## 🚀 Quick Start for Testing

### On Your Computer:
1. Open browser: `http://localhost:3001/api/docs`
2. Test the API endpoints using Swagger UI

### On Your Mobile Device:
1. Find your computer's IP address (use `ipconfig` on Windows)
2. Open browser: `http://YOUR_IP:3001/api/docs`
3. Test the API endpoints

### Example: Test Get Plans
1. Go to API docs
2. Find `GET /api/v1/products/plans`
3. Click "Try it out"
4. Click "Execute"
5. See the response with all available plans!

---

## 📊 What Data is Available?

The database is already seeded with:
- ✅ 2 Plans (PLAN 1299, PLAN 2999)
- ✅ 4 Devices (iPhone 17 series)
- ✅ 15+ Device configurations (colors/storage)
- ✅ 2 Provinces (Metro Manila, Cavite)
- ✅ 3 Cities (Quezon City, Manila, Pasig)
- ✅ 6 Barangays with zip codes
- ✅ 2 Stores
- ✅ 2 Agent accounts

---

## 🎯 Customer User Journey

Once the frontend is built, the customer experience will be:

1. **Open URL:** `http://YOUR_IP:3000` on mobile/tablet
2. **Enter Email** → Click "Send OTP"
3. **Enter OTP** (123456 in dev mode)
4. **Upload ID** (front and back using camera)
5. **Fill Address** (province → city → barangay dropdowns auto-populate)
6. **Employment Info** (select type, fill details)
7. **Review Everything** → Accept terms
8. **Sign** (draw signature with finger/stylus)
9. **Submit** → Get Cart ID
10. **Done!** Application stored in database

---

## 👨‍💼 Agent User Journey

Once the frontend is built, the agent experience will be:

1. **Open URL:** `http://YOUR_IP:3000/agent/login`
2. **Login** with username: `admin`, password: `admin123`
3. **Search** application by Cart ID or National ID
4. **Review** all customer details
5. **Approve or Reject** application
6. **Done!** Status updated in database

---

## 📝 Frontend URLs (To Be Built)

Update the frontend `.env` file with your IP:

**File:** `/mnt/c/new_portfolio/smartify/frontend/.env`
```env
VITE_API_URL=http://YOUR_IP:3001/api/v1
```

Then when you run the frontend:
```bash
cd /mnt/c/new_portfolio/smartify/frontend
npm install
npm run dev
```

It will be available at:
- Local: `http://localhost:3000`
- Network: `http://YOUR_IP:3000`

---

## ✅ Status Check

**Backend:** ✅ RUNNING at http://localhost:3001/api/v1
**Database:** ✅ Connected to PostgreSQL (localhost:5432/smartify)
**API Docs:** ✅ Available at http://localhost:3001/api/docs
**Frontend:** ⏳ Structure ready, components needed

---

## 🆘 Troubleshooting

**Can't access from mobile?**
1. Check both devices are on same WiFi
2. Try `ipconfig` to get correct IP
3. Check Windows Firewall settings
4. Try WSL port forwarding (see above)
5. Make sure backend is running (should show green logs)

**Backend not responding?**
```bash
cd /mnt/c/new_portfolio/smartify/backend
npm run start:dev
```

**Need to stop backend?**
Press `Ctrl+C` in the terminal where it's running

**Need to restart backend?**
```bash
# Stop it (Ctrl+C), then:
npm run start:dev
```

---

## 🎉 You're All Set!

**The backend is fully operational and ready for end users!**

Next step: Build the frontend components and connect them to these APIs.

All the hard work is done - just need a nice UI to make it beautiful! 🚀
