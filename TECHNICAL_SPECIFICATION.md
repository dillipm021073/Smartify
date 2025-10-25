# Smartify - SIM with Device Application System
## Technical Specification Document

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Application Workflows](#application-workflows)
3. [Front-End Architecture](#front-end-architecture)
4. [Back-End Services](#back-end-services)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [UI/UX Requirements](#uiux-requirements)
8. [Security & Authentication](#security--authentication)
9. [Third-Party Integrations](#third-party-integrations)

---

## 1. System Overview

### Purpose
A comprehensive e-commerce platform for customers to purchase mobile devices with SIM plans, complete with identity verification, document upload, and application processing. Includes an agent portal for reviewing and completing applications.

### Key Components
- **Customer Portal**: Self-service application submission
- **Agent Portal**: Application review and processing
- **PostgreSQL Database**: Application data storage
- **Document Storage**: Secure ID document management
- **Email Service**: OTP verification and notifications
- **Payment Gateway**: Transaction processing

---

## 2. Application Workflows

### 2.1 Customer Workflow (Steps 1-7)

#### Step 1: Identity Verification
- Email address input
- OTP generation and verification (6-digit code)
- Auto-fill in development mode
- Email uniqueness validation
- Session creation upon verification

#### Step 2: Document Upload
- ID type selection dropdown:
  - PhilSys ID / ePhilID (National ID)
  - Philippine Passport
  - Driver's License (LTO)
  - SSS ID / UMID Card
  - GSIS e-Card / UMID
  - PRC ID (Professional Regulation Commission)
  - Postal ID
- Front and back document upload
- Gallery or camera options
- Image preview with remove functionality
- Validation and verification status

#### Step 3: Address Information
- Address type: House, Condominium, Building/Apartment
- House/Lot Number (required)
- Street Name (required)
- Village/Subdivision (optional)
- Province dropdown (required)
- City dropdown (required, filtered by province)
- Barangay dropdown (required, filtered by city)
- Zip Code (auto-populated based on barangay)

#### Step 4: Employment Information
- Employment Type selection:
  - Full-time Employee
  - Self-employed
  - Unemployed
- **For Full-time/Self-employed**:
  - Employer Name
  - Employer Contact (with country code)
  - Job Title
  - Position Level dropdown
  - Monthly Income range dropdown
  - Start of Employment Date
  - Employment Address (with "Same as residential" option)
- **For Unemployed**: Proceed without employment details

#### Step 5: Collect from Store
- Store location assignment
- Display assigned branch
- Agent location identifier

#### Step 6: Review Application
- Collapsible sections:
  - Product Details (device, plan, pricing)
  - Customer Information (email, ID, address)
  - Employment Information
- Privacy Preferences (checkboxes):
  - Product offers via messaging apps
  - Offers from trusted partners
  - Customization and personalization
  - Data sharing with sister companies
  - Data sharing with trusted business partners
  - Data sharing with TapaSilog Information Solutions, Inc.
- Terms acceptance:
  - Subscriber Declaration
  - Terms & Conditions
  - Privacy Notice
- Payment Summary sidebar

#### Step 7: Sign & Submit Application
- Digital signature canvas
- Clear signature option
- Complete & Submit button
- Application ID generation
- Confirmation screen with Cart ID
- SMS/Email notification to customer

### 2.2 Agent Workflow

#### Agent Dashboard
- Search functionality:
  - By Application ID
  - By National ID number
- Application status filters
- Pending applications queue

#### Application Retrieval
- Enter Application ID or National ID
- Fetch application from PostgreSQL
- Display all customer-submitted data

#### Application Review
- Review all sections:
  - Device and plan selection
  - Customer identity documents
  - Address verification
  - Employment verification
  - Digital signature
- Edit capabilities (if needed)
- Add internal notes
- Document verification status updates

#### Application Completion
- Final approval/rejection
- Credit evaluation integration (if applicable)
- Submit to cart system
- Generate final order
- Notification to customer

---

## 3. Front-End Architecture

### 3.1 Technology Stack
```
- Framework: React 18+ with TypeScript
- State Management: Redux Toolkit or Zustand
- Routing: React Router v6
- UI Library: Material-UI (MUI) or Tailwind CSS
- Form Management: React Hook Form + Yup validation
- HTTP Client: Axios with interceptors
- Signature Capture: react-signature-canvas
- File Upload: react-dropzone
- Date Picker: react-datepicker or MUI DatePicker
```

### 3.2 Folder Structure
```
src/
├── features/
│   ├── customer/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PlanSelection.tsx
│   │   │   ├── DeviceSelection.tsx
│   │   │   ├── DeviceConfiguration.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── IdentityVerification.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── EmploymentForm.tsx
│   │   │   ├── StoreAssignment.tsx
│   │   │   ├── ReviewApplication.tsx
│   │   │   ├── SignatureCapture.tsx
│   │   │   └── ConfirmationScreen.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── agent/
│   │   ├── components/
│   │   │   ├── AgentDashboard.tsx
│   │   │   ├── ApplicationSearch.tsx
│   │   │   ├── ApplicationReview.tsx
│   │   │   └── ApplicationApproval.tsx
│   │   ├── hooks/
│   │   └── services/
│   └── shared/
│       ├── components/
│       ├── utils/
│       └── constants/
├── store/
├── api/
├── types/
└── styles/
```

### 3.3 Key Features

#### Progressive Form with Stepper
- Multi-step form with progress indicator
- Step validation before proceeding
- Back navigation with data persistence
- Auto-save to localStorage/sessionStorage

#### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly UI elements
- Optimized for tablets and desktops

#### Form Validation
- Real-time field validation
- Server-side validation feedback
- Error message display
- Required field indicators

---

## 4. Back-End Services

### 4.1 Technology Stack
```
- Runtime: Node.js 18+ with TypeScript
- Framework: Express.js or NestJS
- ORM: Prisma or TypeORM
- Database: PostgreSQL 15+
- Authentication: JWT with refresh tokens
- File Storage: AWS S3 or Azure Blob Storage
- Email Service: SendGrid or AWS SES
- SMS Service: Twilio or AWS SNS
- Caching: Redis
- Queue: Bull (Redis-based) for async jobs
```

### 4.2 Microservices Architecture (Recommended)

#### Service 1: Authentication Service
- Email OTP generation and verification
- JWT token management
- Session management
- Agent authentication

#### Service 2: Application Service
- Application CRUD operations
- Application status management
- Application retrieval by ID/National ID
- Application assignment to agents

#### Service 3: Document Service
- Document upload handling
- Image compression and optimization
- Secure storage integration
- Document verification status

#### Service 4: Product Service
- Plan management
- Device catalog
- Pricing and inventory
- Cart management

#### Service 5: Location Service
- Province/City/Barangay data
- Zip code lookup
- Store location management

#### Service 6: Notification Service
- Email notifications
- SMS notifications
- In-app notifications
- Notification templates

---

## 5. Database Schema

### 5.1 PostgreSQL Schema

```sql
-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    email VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    assigned_number VARCHAR(20),
    sim_type VARCHAR(10), -- 'physical' or 'esim'
    signature_url TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_agent_id UUID REFERENCES agents(id),
    store_id UUID REFERENCES stores(id)
);

CREATE INDEX idx_applications_cart_id ON applications(cart_id);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);

-- Customer Information Table
CREATE TABLE customer_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    id_type VARCHAR(50) NOT NULL,
    id_front_url TEXT NOT NULL,
    id_back_url TEXT NOT NULL,
    national_id VARCHAR(50),
    id_verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_national_id ON customer_information(national_id);

-- Address Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL, -- 'residential' or 'employment'
    type_detail VARCHAR(50), -- 'house', 'condominium', 'building'
    house_lot_number VARCHAR(100) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    village_subdivision VARCHAR(255),
    province_id INTEGER REFERENCES provinces(id),
    city_id INTEGER REFERENCES cities(id),
    barangay_id INTEGER REFERENCES barangays(id),
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employment Information Table
CREATE TABLE employment_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    employment_type VARCHAR(20) NOT NULL, -- 'full-time', 'self-employed', 'unemployed'
    employer_name VARCHAR(255),
    employer_contact VARCHAR(20),
    job_title VARCHAR(255),
    position_level VARCHAR(50),
    monthly_income_range VARCHAR(50),
    employment_start_date DATE,
    same_as_residential BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products and Plans
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    images JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE device_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id),
    color VARCHAR(50),
    storage VARCHAR(50),
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Order Details
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    device_id UUID REFERENCES devices(id),
    device_config_id UUID REFERENCES device_configurations(id),
    device_price DECIMAL(10, 2) NOT NULL,
    plan_price DECIMAL(10, 2) NOT NULL,
    one_time_cashout DECIMAL(10, 2) NOT NULL,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location Data
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10)
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    province_id INTEGER REFERENCES provinces(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10)
);

CREATE TABLE barangays (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10)
);

-- Stores
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES cities(id),
    address TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Agents
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    store_id UUID REFERENCES stores(id),
    role VARCHAR(50) DEFAULT 'agent',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Privacy Preferences
CREATE TABLE privacy_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    product_offers BOOLEAN DEFAULT false,
    trusted_partners BOOLEAN DEFAULT false,
    customization BOOLEAN DEFAULT false,
    sister_companies BOOLEAN DEFAULT false,
    business_partners BOOLEAN DEFAULT false,
    tapasilog_solutions BOOLEAN DEFAULT false,
    terms_accepted BOOLEAN DEFAULT false,
    privacy_notice_accepted BOOLEAN DEFAULT false,
    subscriber_declaration_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id),
    agent_id UUID REFERENCES agents(id),
    action VARCHAR(100) NOT NULL,
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Verification
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
```

---

## 6. API Endpoints

### 6.1 Customer APIs

#### Authentication
```
POST   /api/v1/auth/send-otp
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/refresh-token
```

#### Application Management
```
POST   /api/v1/applications
GET    /api/v1/applications/:id
PUT    /api/v1/applications/:id
PATCH  /api/v1/applications/:id/status
POST   /api/v1/applications/:id/submit
```

#### Documents
```
POST   /api/v1/applications/:id/documents/upload
GET    /api/v1/applications/:id/documents
DELETE /api/v1/applications/:id/documents/:documentId
```

#### Products
```
GET    /api/v1/plans
GET    /api/v1/plans/:id
GET    /api/v1/devices
GET    /api/v1/devices/:id
GET    /api/v1/devices/:id/configurations
```

#### Location
```
GET    /api/v1/locations/provinces
GET    /api/v1/locations/provinces/:id/cities
GET    /api/v1/locations/cities/:id/barangays
GET    /api/v1/locations/barangays/:id/zipcode
```

#### Cart
```
POST   /api/v1/cart
GET    /api/v1/cart/:id
PUT    /api/v1/cart/:id
POST   /api/v1/cart/:id/checkout
```

#### Stores
```
GET    /api/v1/stores
GET    /api/v1/stores/nearest
```

### 6.2 Agent APIs

#### Authentication
```
POST   /api/v1/agent/auth/login
POST   /api/v1/agent/auth/logout
POST   /api/v1/agent/auth/refresh
```

#### Application Management
```
GET    /api/v1/agent/applications
GET    /api/v1/agent/applications/search?q=
GET    /api/v1/agent/applications/:id
GET    /api/v1/agent/applications/by-national-id/:nationalId
PUT    /api/v1/agent/applications/:id
PATCH  /api/v1/agent/applications/:id/review
POST   /api/v1/agent/applications/:id/approve
POST   /api/v1/agent/applications/:id/reject
POST   /api/v1/agent/applications/:id/submit-to-cart
POST   /api/v1/agent/applications/:id/notes
```

#### Dashboard
```
GET    /api/v1/agent/dashboard/stats
GET    /api/v1/agent/dashboard/pending-applications
```

---

## 7. UI/UX Requirements

### 7.1 Design System

#### Color Palette
```
Primary: #006B54 (Smart Green)
Secondary: #000000 (Black)
Accent: #00C896 (Light Green)
Background: #F5F5F5 (Light Gray)
Error: #D32F2F (Red)
Success: #4CAF50 (Green)
Warning: #FF9800 (Orange)
Text Primary: #1A1A1A
Text Secondary: #666666
```

#### Typography
```
Font Family:
  - Primary: "Inter", "Roboto", sans-serif
  - Headings: "Poppins", sans-serif

Font Sizes:
  - H1: 32px / 2rem
  - H2: 24px / 1.5rem
  - H3: 20px / 1.25rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem
  - Caption: 12px / 0.75rem
```

#### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### 7.2 Component Specifications

#### Header
- Fixed top navigation
- Logo on left
- User welcome message on right
- Logout button for agents
- Dark background (#000000)

#### Stepper/Progress Indicator
- Show current step (e.g., "Step 1 of 7")
- Progress bar showing completion percentage
- Step labels
- Green active step, gray inactive

#### Form Fields
- Floating labels or top-aligned labels
- Required field indicator (*)
- Error messages below field in red
- Success validation checkmark (green)
- Placeholder text in light gray
- Focus state with primary color border

#### Buttons
```
Primary:
  - Background: #006B54
  - Text: White
  - Hover: #005544
  - Radius: 8px
  - Padding: 12px 24px

Secondary:
  - Background: Transparent
  - Border: 1px solid #006B54
  - Text: #006B54
  - Hover: Light green background

Disabled:
  - Background: #CCCCCC
  - Text: #666666
  - Cursor: not-allowed
```

#### Cards
```
Background: White
Border: 1px solid #E0E0E0
Border Radius: 12px
Box Shadow: 0 2px 8px rgba(0,0,0,0.1)
Padding: 24px
```

#### Modals/Dialogs
```
Overlay: rgba(0,0,0,0.5)
Background: White
Border Radius: 16px
Max Width: 600px
Padding: 32px
Close button: Top right corner
```

### 7.3 Screen-Specific Requirements

#### Dashboard
- Hero banner with featured device
- Product cards in grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Filters sidebar
- Sort dropdown
- Hover effects on product cards

#### Plan Selection
- Filter sidebar (brand, price range)
- Plan cards with badge indicators ("NEW", "UNLI DATA")
- "Select Plan" CTA button
- Compare plans functionality
- Grid/List view toggle

#### Device Configuration
- Device image on left (40% width)
- Configuration options on right (60% width)
- Color selector with color swatches
- Storage selector as button group
- Price summary card (sticky on scroll)
- "Add to Cart & Continue" button

#### Document Upload
- Drag-and-drop zone
- File type restrictions (.jpg, .jpeg, .png, .pdf)
- File size limit (5MB)
- Image preview with thumbnail
- Camera capture option (mobile)
- Upload progress indicator

#### Review Application
- Accordion/collapsible sections
- Edit button for each section
- Summary sidebar (sticky)
- Checkbox list for privacy preferences
- Required acceptance for terms
- "Sign & Submit" button (disabled until all required fields complete)

#### Signature Capture
- Canvas area with border
- Clear signature button
- Touch/mouse support
- Signature preview
- "Complete & Submit" button

---

## 8. Security & Authentication

### 8.1 Customer Authentication
- Email-based OTP (6 digits)
- OTP expiry: 5 minutes
- Maximum 3 verification attempts
- Session token after verification (JWT)
- Session expiry: 24 hours
- Refresh token mechanism

### 8.2 Agent Authentication
- Username/password login
- Password requirements:
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 number, 1 special char
- JWT tokens with role-based access
- Access token expiry: 1 hour
- Refresh token expiry: 7 days
- MFA optional (TOTP)

### 8.3 Data Security
- HTTPS only (TLS 1.3)
- Password hashing: bcrypt (12 rounds)
- Sensitive data encryption at rest (AES-256)
- Document storage: Encrypted S3 buckets
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)
- CSRF tokens for state-changing operations
- Rate limiting on all endpoints
- Input sanitization and validation

### 8.4 Privacy Compliance
- GDPR/Data Privacy Act compliance
- Right to access data
- Right to deletion
- Data retention policy
- Audit logging for all data access
- Consent management

---

## 9. Third-Party Integrations

### 9.1 Email Service (SendGrid/AWS SES)
```javascript
// OTP Email Template
{
  subject: "Your Smartify Verification Code",
  template: "otp-verification",
  data: {
    otp: "123456",
    expiryMinutes: 5,
    email: "customer@example.com"
  }
}
```

### 9.2 SMS Service (Twilio)
```javascript
// SMS Notification
{
  to: "+639171234567",
  message: "Your Smartify application CART-123456789 has been submitted. Track your order at smartify.com"
}
```

### 9.3 File Storage (AWS S3)
```
Bucket Structure:
/documents/
  /{applicationId}/
    /id-front.jpg
    /id-back.jpg
/signatures/
  /{applicationId}/
    /signature.png
```

### 9.4 ID Verification API (Optional)
- Integration with ID verification service (e.g., Onfido, Jumio)
- Automatic ID data extraction
- Liveness detection
- Fraud detection

### 9.5 Payment Gateway (Optional for future)
- PayMongo, PayPal, Stripe integration
- Installment payment support
- Payment status webhooks

---

## 10. Deployment & DevOps

### 10.1 Infrastructure
```
Frontend: Vercel, Netlify, or AWS Amplify
Backend: AWS EC2, ECS, or Google Cloud Run
Database: AWS RDS PostgreSQL or Supabase
File Storage: AWS S3 or Azure Blob
CDN: CloudFront or Cloudflare
```

### 10.2 CI/CD Pipeline
```
- GitHub Actions or GitLab CI
- Automated testing (Jest, Cypress)
- Linting and code quality checks
- Build and deploy on merge to main
- Staging and production environments
```

### 10.3 Monitoring
```
- Application monitoring: New Relic, Datadog
- Error tracking: Sentry
- Logging: CloudWatch, Elasticsearch
- Uptime monitoring: Pingdom, UptimeRobot
```

---

## 11. Testing Strategy

### 11.1 Unit Tests
- React components (React Testing Library)
- API endpoints (Jest + Supertest)
- Utility functions
- Coverage target: 80%

### 11.2 Integration Tests
- API integration tests
- Database operations
- Third-party service mocks

### 11.3 E2E Tests
- Cypress or Playwright
- Critical user flows:
  - Complete application submission
  - Agent application review
  - Document upload
  - Signature capture

---

## 12. Performance Requirements

### 12.1 Load Requirements
- Support 1000 concurrent users
- Application submission: < 2 seconds
- Page load time: < 3 seconds
- API response time: < 500ms (p95)

### 12.2 Optimization
- Image lazy loading
- Code splitting
- CDN for static assets
- Database indexing
- Redis caching for frequent queries
- Gzip compression

---

## Next Steps

1. **Phase 1**: Setup development environment
   - Initialize React frontend
   - Setup NestJS/Express backend
   - Configure PostgreSQL database
   - Setup basic authentication

2. **Phase 2**: Implement customer workflow
   - Build form components
   - Implement OTP verification
   - Document upload functionality
   - Signature capture

3. **Phase 3**: Implement agent portal
   - Agent dashboard
   - Application search and retrieval
   - Review interface

4. **Phase 4**: Testing and deployment
   - Comprehensive testing
   - Performance optimization
   - Production deployment
   - Monitoring setup

---

**Document Version**: 1.0
**Last Updated**: 2025-10-24
**Author**: Technical Architecture Team
