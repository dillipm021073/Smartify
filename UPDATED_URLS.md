# 📱 Smartify - Updated End User URLs (Ports Changed)

## ✅ NEW PORTS CONFIGURATION

**Backend:** Port **5001** (changed from 3001)
**Frontend:** Port **5000** (changed from 3000)

---

## 🖥️ Desktop/Laptop Access

### Backend API Base URL
```
http://localhost:5001/api/v1
```

### Interactive API Documentation (Swagger)
```
http://localhost:5001/api/docs
```
👉 **Open this in your browser to see all available endpoints and test them!**

### Frontend (When Built)
```
http://localhost:5000
```

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

**Backend API:**
```
http://YOUR_IP:5001/api/v1
http://YOUR_IP:5001/api/docs
```

**Frontend (When Built):**
```
http://YOUR_IP:5000
```

**Example (if your IP is 192.168.1.100):**
```
Backend: http://192.168.1.100:5001/api/v1
Frontend: http://192.168.1.100:5000
```

---

## 🎯 Customer Portal URLs (Frontend - When Built)

### Desktop
```
http://localhost:5000
```

### Mobile (Same WiFi)
```
http://YOUR_IP:5000
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
http://localhost:5000/agent/login
```

### Mobile (Same WiFi)
```
http://YOUR_IP:5000/agent/login
```

---

## 🧪 Test the Backend

### Using Browser
```
http://localhost:5001/api/docs
```

### Using curl

**Get all plans:**
```bash
curl http://localhost:5001/api/v1/products/plans
```

**Get all devices:**
```bash
curl http://localhost:5001/api/v1/products/devices
```

**Agent Login:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/agent/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Customer - Send OTP:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com"}'
```

---

## 🔑 Test Credentials

**Agent Login:**
- Username: `admin` or `agent1`
- Password: `admin123`

**Customer OTP (Development Mode):**
- Any email: `test@example.com`
- OTP Code: `123456`

---

## ⚙️ Configuration Files Updated

### Backend
✅ `/backend/.env` - PORT changed to 5001
✅ `/backend/src/main.ts` - Default port changed to 5001
✅ CORS origins updated to port 5000

### Frontend
✅ `/frontend/vite.config.ts` - Port changed to 5000
✅ `/frontend/.env` - API URL updated to http://localhost:5001/api/v1

---

## 🚀 Starting the Services

### Backend
```bash
cd /mnt/c/new_portfolio/smartify/backend
npm run start:dev
```

The backend will start on port **5001**

### Frontend (When Ready)
```bash
cd /mnt/c/new_portfolio/smartify/frontend
npm install
npm run dev
```

The frontend will start on port **5000**

---

## 🌐 Complete API Endpoints

All endpoints remain the same, just the base URL changed:

**Old:** `http://localhost:3001/api/v1`
**New:** `http://localhost:5001/api/v1`

### Authentication
- `POST /api/v1/auth/send-otp`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/agent/login`

### Applications (Customer)
- `POST /api/v1/applications`
- `GET /api/v1/applications/:id`
- `PUT /api/v1/applications/:id/customer-info`
- `PUT /api/v1/applications/:id/address`
- `PUT /api/v1/applications/:id/employment`
- `PUT /api/v1/applications/:id/privacy`
- `POST /api/v1/applications/:id/submit`

### Products
- `GET /api/v1/products/plans`
- `GET /api/v1/products/devices`
- `GET /api/v1/products/stores`

### Locations
- `GET /api/v1/locations/provinces`
- `GET /api/v1/locations/provinces/:id/cities`
- `GET /api/v1/locations/cities/:id/barangays`

### File Upload
- `POST /api/v1/upload/document`
- `POST /api/v1/upload/signature`

---

## ⚠️ WSL Port Forwarding (If Needed)

If you're using WSL and need to access from mobile, set up port forwarding:

**In PowerShell (Run as Administrator):**
```powershell
# Backend
netsh interface portproxy add v4tov4 listenport=5001 listenaddress=0.0.0.0 connectport=5001 connectaddress=172.19.139.160

# Frontend (when ready)
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.19.139.160
```

**To view port forwarding rules:**
```powershell
netsh interface portproxy show v4tov4
```

**To remove port forwarding:**
```powershell
netsh interface portproxy delete v4tov4 listenport=5001 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=5000 listenaddress=0.0.0.0
```

---

## 🔥 Firewall Rules

Update Windows Firewall to allow the new ports:

1. Open Windows Defender Firewall → Advanced Settings
2. Inbound Rules → New Rule
3. Port → TCP → Specific ports: **5000, 5001**
4. Allow the connection
5. Apply to all profiles
6. Name: "Smartify Backend & Frontend"

---

## ✅ Summary of Changes

| Item | Old Port | New Port | URL |
|------|----------|----------|-----|
| Backend API | 3001 | **5001** | http://localhost:5001/api/v1 |
| API Docs | 3001 | **5001** | http://localhost:5001/api/docs |
| Frontend | 3000 | **5000** | http://localhost:5000 |

**Reason:** Avoiding conflicts with system services on ports 3000-3001

---

## 🎉 Status

**Configuration:** ✅ All files updated
**Backend:** 🔄 Restarting on port 5001
**Frontend:** ⏳ Ready to start on port 5000

Once the backend finishes restarting, you can access:
- **API Docs:** http://localhost:5001/api/docs
- **Test Endpoint:** http://localhost:5001/api/v1/products/plans

**All functionality remains the same - only the ports have changed!**
