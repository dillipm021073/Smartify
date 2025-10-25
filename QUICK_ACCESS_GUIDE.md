# 🚀 Smartify - Quick Access Guide

## ⚠️ Important Note

The base URL `http://localhost:5001/api/v1` **will show a 404 error** - this is normal!

You need to access **specific endpoints** or the **API Documentation**.

---

## ✅ CORRECT URLS TO ACCESS

### 1. **API Documentation (START HERE!)**
```
http://localhost:5001/api/docs
```
👉 **Open this URL in your browser to see ALL available endpoints and test them!**

This gives you an interactive Swagger UI where you can:
- See all available endpoints
- Test each endpoint directly
- View request/response examples
- No need to use curl or Postman!

---

### 2. **Quick Test Endpoints**

Try these URLs directly in your browser:

**Get All Plans:**
```
http://localhost:5001/api/v1/products/plans
```

**Get All Devices:**
```
http://localhost:5001/api/v1/products/devices
```

**Get All Provinces:**
```
http://localhost:5001/api/v1/locations/provinces
```

**Get All Stores:**
```
http://localhost:5001/api/v1/products/stores
```

---

## 📋 All Available GET Endpoints (Open in Browser)

### Products
```
http://localhost:5001/api/v1/products/plans
http://localhost:5001/api/v1/products/plans/plan-1299
http://localhost:5001/api/v1/products/devices
http://localhost:5001/api/v1/products/devices/device-iphone-17-pro-max
http://localhost:5001/api/v1/products/stores
```

### Locations
```
http://localhost:5001/api/v1/locations/provinces
http://localhost:5001/api/v1/locations/provinces/1/cities
http://localhost:5001/api/v1/locations/cities/1/barangays
http://localhost:5001/api/v1/locations/barangays/1/zipcode
```

---

## 🧪 Testing POST Endpoints (Use API Docs or curl)

For POST endpoints, you'll need to use the Swagger UI or curl:

### Agent Login (curl example)
```bash
curl -X POST http://localhost:5001/api/v1/auth/agent/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Send OTP (curl example)
```bash
curl -X POST http://localhost:5001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Verify OTP (curl example)
```bash
curl -X POST http://localhost:5001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otpCode":"123456"}'
```

---

## 🎯 Best Way to Explore the API

### Option 1: Swagger UI (RECOMMENDED)
1. Open: `http://localhost:5001/api/docs`
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters (if needed)
5. Click "Execute"
6. See the response!

### Option 2: Browser (for GET endpoints only)
Just paste the URL in your browser:
```
http://localhost:5001/api/v1/products/plans
```

### Option 3: curl (for all endpoints)
Use the curl commands shown above

---

## 📱 Mobile/Tablet Access

Replace `localhost` with your computer's IP address:

**API Docs:**
```
http://YOUR_IP:5001/api/docs
```

**Example (if IP is 192.168.1.100):**
```
http://192.168.1.100:5001/api/docs
http://192.168.1.100:5001/api/v1/products/plans
```

---

## 🔍 Complete Endpoint Reference

### Authentication
| Method | Endpoint | Public |
|--------|----------|--------|
| POST | `/api/v1/auth/send-otp` | ✅ |
| POST | `/api/v1/auth/verify-otp` | ✅ |
| POST | `/api/v1/auth/agent/login` | ✅ |

### Applications (Customer)
| Method | Endpoint | Public |
|--------|----------|--------|
| POST | `/api/v1/applications` | ✅ |
| GET | `/api/v1/applications/:id` | ✅ |
| GET | `/api/v1/applications/cart/:cartId` | ✅ |
| PUT | `/api/v1/applications/:id/customer-info` | ✅ |
| PUT | `/api/v1/applications/:id/address` | ✅ |
| PUT | `/api/v1/applications/:id/employment` | ✅ |
| PUT | `/api/v1/applications/:id/privacy` | ✅ |
| POST | `/api/v1/applications/:id/submit` | ✅ |

### Applications (Agent - Auth Required)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/applications` | 🔒 |
| GET | `/api/v1/applications/search/by-national-id/:id` | 🔒 |
| PATCH | `/api/v1/applications/:id/status` | 🔒 |

### Products
| Method | Endpoint | Public |
|--------|----------|--------|
| GET | `/api/v1/products/plans` | ✅ |
| GET | `/api/v1/products/plans/:id` | ✅ |
| GET | `/api/v1/products/devices` | ✅ |
| GET | `/api/v1/products/devices/:id` | ✅ |
| GET | `/api/v1/products/devices/:id/configurations` | ✅ |
| GET | `/api/v1/products/stores` | ✅ |

### Locations
| Method | Endpoint | Public |
|--------|----------|--------|
| GET | `/api/v1/locations/provinces` | ✅ |
| GET | `/api/v1/locations/provinces/:id/cities` | ✅ |
| GET | `/api/v1/locations/cities/:id/barangays` | ✅ |
| GET | `/api/v1/locations/barangays/:id/zipcode` | ✅ |

### File Upload
| Method | Endpoint | Public |
|--------|----------|--------|
| POST | `/api/v1/upload/document` | ✅ |
| POST | `/api/v1/upload/documents` | ✅ |
| POST | `/api/v1/upload/signature` | ✅ |

---

## 💡 Quick Tips

1. **Start with the Swagger UI** - It's the easiest way to explore
2. **Use browser for GET endpoints** - Just paste the URL
3. **Use Swagger or curl for POST/PUT endpoints** - They need request bodies
4. **Check response status** - 200 = success, 404 = not found, 401 = unauthorized

---

## 🆘 Troubleshooting

### Getting 404 Error?
✅ **This is normal for `/api/v1` root**
❌ Don't access: `http://localhost:5001/api/v1`
✅ Instead access: `http://localhost:5001/api/docs` or `http://localhost:5001/api/v1/products/plans`

### Getting CORS Error?
- Make sure you're accessing from `localhost` or the same network
- Check backend logs for errors

### Backend Not Responding?
- Check if backend is running (look for green logs)
- Try restarting: `cd backend && npm run start:dev`

---

## 🎉 Ready to Test!

**START HERE:**
```
http://localhost:5001/api/docs
```

This will open the interactive API documentation where you can test everything! 🚀
