# Smartify SIM Backend API Documentation

## Base URL
Development: `http://localhost:5001`

All API routes are prefixed with `/api`

---

## Authentication

### Agent Login
Authenticate an agent to access the agent portal.

**Endpoint:** `POST /api/agent/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "agent": {
    "id": "agent-admin",
    "username": "admin",
    "email": "admin@smartify.com",
    "fullName": "Admin User",
    "storeId": "store-main-qc",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-10-24T..."
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Location APIs

### Get All Provinces
Retrieve all available provinces.

**Endpoint:** `GET /api/locations/provinces`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Metro Manila",
    "code": "NCR"
  },
  {
    "id": 2,
    "name": "Cavite",
    "code": "CAV"
  }
]
```

### Get Cities by Province
Retrieve cities for a specific province.

**Endpoint:** `GET /api/locations/cities/:provinceId`

**Parameters:**
- `provinceId` (number): Province ID

**Response (200):**
```json
[
  {
    "id": 1,
    "provinceId": 1,
    "name": "Quezon City",
    "code": "QC"
  }
]
```

### Get Barangays by City
Retrieve barangays for a specific city.

**Endpoint:** `GET /api/locations/barangays/:cityId`

**Parameters:**
- `cityId` (number): City ID

**Response (200):**
```json
[
  {
    "id": 1,
    "cityId": 1,
    "name": "Barangay Commonwealth",
    "zipCode": "1121"
  }
]
```

---

## Plans & Devices

### Get All Plans
Retrieve all active SIM plans.

**Endpoint:** `GET /api/plans`

**Response (200):**
```json
[
  {
    "id": "plan-1299",
    "name": "PLAN 1299",
    "price": "1299.00",
    "durationMonths": 12,
    "features": {
      "data": "25GB DATA",
      "calls": "Unli All-Net Mobile Calls & Texts",
      "landline": "Unli Landline Calls",
      "streaming": "Netflix Mobile"
    },
    "isActive": true,
    "createdAt": "2025-10-24T...",
    "updatedAt": "2025-10-24T..."
  }
]
```

### Get All Devices
Retrieve all active devices.

**Endpoint:** `GET /api/devices`

**Response (200):**
```json
[
  {
    "id": "device-iphone-17-pro-max",
    "name": "iPhone 17 Pro Max",
    "brand": "Apple",
    "model": "iPhone 17 Pro Max",
    "basePrice": "89990.00",
    "description": "The ultimate iPhone...",
    "images": ["/images/iphone-17-pro-max-blue.jpg"],
    "isActive": true,
    "createdAt": "2025-10-24T...",
    "updatedAt": "2025-10-24T..."
  }
]
```

### Get Device Configurations
Retrieve configurations (colors, storage) for a specific device.

**Endpoint:** `GET /api/devices/:id/configurations`

**Parameters:**
- `id` (string): Device ID

**Response (200):**
```json
[
  {
    "id": "config-001",
    "deviceId": "device-iphone-17-pro-max",
    "color": "Deep Blue",
    "storage": "256GB",
    "priceAdjustment": "6000.00",
    "stockQuantity": 8,
    "isActive": true
  }
]
```

---

## Stores

### Get All Stores
Retrieve all active stores.

**Endpoint:** `GET /api/stores`

**Response (200):**
```json
[
  {
    "id": "store-main-qc",
    "name": "Main Store - Quezon City",
    "cityId": 1,
    "address": "Commonwealth Avenue, Quezon City, Metro Manila",
    "isActive": true
  }
]
```

---

## OTP / Email Verification

### Send OTP
Send an OTP code to a customer's email.

**Endpoint:** `POST /api/otp/send`

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Development mode: Use OTP 123456"
}
```

**Note:** In development mode (DEV_MODE=true), the OTP is fixed at "123456" for testing purposes.

### Verify OTP
Verify an OTP code.

**Endpoint:** `POST /api/otp/verify`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "otpCode": "123456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid or expired OTP"
}
```

---

## Applications (Customer Portal)

### Create Application
Create a new application to start the application process.

**Endpoint:** `POST /api/applications`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "simType": "physical"
}
```

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "email": "customer@example.com",
  "simType": "physical",
  "status": "pending",
  "emailVerified": false,
  "createdAt": "2025-10-24T...",
  "updatedAt": "2025-10-24T..."
}
```

### Get Application by Cart ID
Retrieve application details by cart ID.

**Endpoint:** `GET /api/applications/:cartId`

**Parameters:**
- `cartId` (string): Cart ID

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "email": "customer@example.com",
  "status": "pending",
  "customerInformation": { ... },
  "addresses": [ ... ],
  "employmentInformation": { ... },
  "orderItems": [ ... ],
  "privacyPreferences": { ... }
}
```

### Update Application
Update application details.

**Endpoint:** `PUT /api/applications/:id`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "emailVerified": true,
  "simType": "esim"
}
```

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "emailVerified": true,
  "simType": "esim",
  "updatedAt": "2025-10-24T..."
}
```

### Add Customer Information
Add customer ID information to an application.

**Endpoint:** `POST /api/applications/:id/customer-information`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "idType": "passport",
  "idFrontUrl": "/uploads/id-front.jpg",
  "idBackUrl": "/uploads/id-back.jpg",
  "nationalId": "1234567890"
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Add Address
Add an address to an application.

**Endpoint:** `POST /api/applications/:id/addresses`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "addressType": "residential",
  "typeDetail": "house",
  "houseLotNumber": "123",
  "streetName": "Main Street",
  "villageSubdivision": "Village A",
  "provinceId": 1,
  "cityId": 1,
  "barangayId": 1,
  "zipCode": "1121"
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Add Employment Information
Add employment information to an application.

**Endpoint:** `POST /api/applications/:id/employment`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "employmentType": "full-time",
  "employerName": "ABC Corporation",
  "employerContact": "02-1234567",
  "jobTitle": "Software Engineer",
  "positionLevel": "senior",
  "monthlyIncomeRange": "50-75k",
  "employmentStartDate": "2020-01-15T00:00:00Z",
  "sameAsResidential": false
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Add Order Item
Add a plan and device selection to an application.

**Endpoint:** `POST /api/applications/:id/order-items`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "planId": "plan-1299",
  "deviceId": "device-iphone-17-pro-max",
  "deviceConfigId": "config-001",
  "devicePrice": "89990.00",
  "planPrice": "1299.00",
  "oneTimeCashout": "5999.00",
  "monthlyPayment": "3541.67"
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Add Privacy Preferences
Add privacy preferences to an application.

**Endpoint:** `POST /api/applications/:id/privacy-preferences`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "productOffers": false,
  "trustedPartners": false,
  "customization": false,
  "sisterCompanies": false,
  "businessPartners": false,
  "tapasilogSolutions": false,
  "termsAccepted": true,
  "privacyNoticeAccepted": true,
  "subscriberDeclarationAccepted": true
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Submit Application
Submit the application with signature.

**Endpoint:** `POST /api/applications/:id/submit`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "signatureUrl": "/uploads/signature.png"
}
```

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "status": "submitted",
  "signatureUrl": "/uploads/signature.png",
  "submittedAt": "2025-10-24T...",
  "updatedAt": "2025-10-24T..."
}
```

---

## Agent Applications

### Search Applications
Search or filter applications (for agents).

**Endpoint:** `GET /api/agent/applications`

**Query Parameters:**
- `search` (string, optional): Search term to filter by cart ID or email
- `status` (string, optional): Filter by application status

**Examples:**
- `/api/agent/applications` - Get all pending and in_review applications
- `/api/agent/applications?search=CART-123` - Search by cart ID
- `/api/agent/applications?status=approved` - Get approved applications

**Response (200):**
```json
[
  {
    "id": "app-uuid",
    "cartId": "CART-17303046936571234",
    "email": "customer@example.com",
    "status": "pending",
    "createdAt": "2025-10-24T...",
    "submittedAt": "2025-10-24T..."
  }
]
```

### Get Application Details
Get full application details with all related data (for agents).

**Endpoint:** `GET /api/agent/applications/:id`

**Parameters:**
- `id` (string): Application ID

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "email": "customer@example.com",
  "status": "pending",
  "customerInformation": {
    "idType": "passport",
    "nationalId": "1234567890",
    ...
  },
  "addresses": [
    {
      "addressType": "residential",
      "houseLotNumber": "123",
      "streetName": "Main Street",
      "barangay": {
        "name": "Barangay Commonwealth",
        "zipCode": "1121"
      },
      ...
    }
  ],
  "employmentInformation": { ... },
  "orderItems": [
    {
      "plan": {
        "name": "PLAN 1299",
        "price": "1299.00",
        ...
      },
      "device": {
        "name": "iPhone 17 Pro Max",
        "brand": "Apple",
        ...
      },
      "deviceConfiguration": {
        "color": "Deep Blue",
        "storage": "256GB",
        ...
      },
      ...
    }
  ],
  "privacyPreferences": { ... }
}
```

### Update Application Status
Update the status of an application (approve/reject).

**Endpoint:** `PUT /api/agent/applications/:id/status`

**Parameters:**
- `id` (string): Application ID

**Request Body:**
```json
{
  "status": "approved",
  "agentId": "agent-admin",
  "notes": "All documents verified"
}
```

**Response (200):**
```json
{
  "id": "app-uuid",
  "cartId": "CART-17303046936571234",
  "status": "approved",
  "assignedAgentId": "agent-admin",
  "updatedAt": "2025-10-24T..."
}
```

---

## Status Values

### Application Status
- `pending` - Application created but not yet submitted
- `submitted` - Application submitted by customer
- `in_review` - Application under review by agent
- `approved` - Application approved
- `rejected` - Application rejected

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process request"
}
```

---

## Development Notes

### Environment Variables
Ensure the following are set in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `DEV_MODE` - Set to "true" for development mode
- `DEV_OTP_CODE` - Fixed OTP code for development (default: "123456")
- `OTP_EXPIRY_MINUTES` - OTP expiry time in minutes (default: 5)
- `OTP_MAX_ATTEMPTS` - Maximum OTP verification attempts (default: 3)

### Database Seeding
The database is already seeded with:
- 2 Agents (admin/admin123, agent1/admin123)
- 2 Provinces (Metro Manila, Cavite)
- 3 Cities (Quezon City, Manila, Pasig)
- 6 Barangays
- 2 Stores
- 2 Plans
- 4 Devices
- 17 Device Configurations

### Testing
Use the following credentials to test agent login:
- Username: `admin` / Password: `admin123`
- Username: `agent1` / Password: `admin123`

OTP in development mode is always: `123456`
