# Smartify SIM with Device - Implementation Prompt

## Project Summary
Build a full-stack e-commerce application for purchasing mobile devices with SIM plans, featuring a customer self-service portal and an agent review portal, with PostgreSQL database storage.

---

## Customer Portal Flow (7 Steps)

### Step 1: Identity Verification
- Email input with OTP verification
- 6-digit code, 5-minute expiry
- Development mode auto-fill

### Step 2: Document Upload
- Select ID type (Philippine Passport, National ID, Driver's License, etc.)
- Upload front and back images
- Gallery or camera capture options
- Image preview and validation

### Step 3: Address Information
- Address type: House/Condominium/Building
- Complete address with Province → City → Barangay cascade
- Auto-populated zip code

### Step 4: Employment Information
- Employment type: Full-time/Self-employed/Unemployed
- For employed: employer details, job title, position level, monthly income, start date
- Employment address (can reuse residential)

### Step 5: Store Assignment
- Display assigned store location for collection
- Agent location identifier

### Step 6: Review Application
- Collapsible sections: Product Details, Customer Info, Employment Info
- Privacy preferences (6 checkboxes)
- Terms acceptance (3 required checkboxes)
- Payment summary sidebar

### Step 7: Sign & Submit
- Digital signature canvas
- Generate unique Cart ID (format: CART-{timestamp}{random})
- Send confirmation SMS/Email
- Display success screen

---

## Agent Portal Flow

### Features Required:
1. **Search Applications**
   - By Application/Cart ID
   - By National ID number

2. **Review Application**
   - View all customer-submitted data
   - Verify documents
   - Add internal notes

3. **Process Application**
   - Approve or reject
   - Submit approved applications to cart
   - Update application status

---

## Tech Stack Recommendation

### Frontend
```
- React 18 + TypeScript
- Tailwind CSS or Material-UI
- React Hook Form + Yup
- React Router v6
- Axios
- Zustand or Redux Toolkit
- react-signature-canvas
- react-dropzone
```

### Backend
```
- Node.js + TypeScript
- NestJS or Express
- Prisma ORM
- PostgreSQL 15+
- JWT authentication
- bcrypt for passwords
- AWS S3 for document storage
- SendGrid for emails
- Redis for caching/sessions
```

---

## Database Core Tables

```sql
applications
├── id (UUID, PK)
├── cart_id (VARCHAR, UNIQUE)
├── email (VARCHAR)
├── status (VARCHAR) -- 'pending', 'in_review', 'approved', 'rejected'
├── signature_url (TEXT)
├── submitted_at (TIMESTAMP)
└── store_id (UUID, FK)

customer_information
├── id (UUID, PK)
├── application_id (UUID, FK)
├── id_type (VARCHAR)
├── id_front_url (TEXT)
├── id_back_url (TEXT)
├── national_id (VARCHAR)
└── id_verification_status (VARCHAR)

addresses
├── id (UUID, PK)
├── application_id (UUID, FK)
├── address_type (VARCHAR) -- 'residential', 'employment'
├── house_lot_number (VARCHAR)
├── street_name (VARCHAR)
├── province_id (INT, FK)
├── city_id (INT, FK)
├── barangay_id (INT, FK)
└── zip_code (VARCHAR)

employment_information
├── id (UUID, PK)
├── application_id (UUID, FK)
├── employment_type (VARCHAR)
├── employer_name (VARCHAR)
├── job_title (VARCHAR)
├── position_level (VARCHAR)
├── monthly_income_range (VARCHAR)
└── employment_start_date (DATE)

order_items
├── id (UUID, PK)
├── application_id (UUID, FK)
├── plan_id (UUID, FK)
├── device_id (UUID, FK)
├── device_price (DECIMAL)
├── one_time_cashout (DECIMAL)
└── monthly_payment (DECIMAL)

privacy_preferences
├── id (UUID, PK)
├── application_id (UUID, FK)
├── product_offers (BOOLEAN)
├── trusted_partners (BOOLEAN)
├── customization (BOOLEAN)
└── terms_accepted (BOOLEAN)

agents
├── id (UUID, PK)
├── username (VARCHAR)
├── email (VARCHAR)
├── password_hash (TEXT)
└── store_id (UUID, FK)
```

---

## Key API Endpoints

### Customer APIs
```
POST   /api/v1/auth/send-otp
POST   /api/v1/auth/verify-otp
POST   /api/v1/applications
PUT    /api/v1/applications/:id
POST   /api/v1/applications/:id/documents/upload
POST   /api/v1/applications/:id/submit
GET    /api/v1/plans
GET    /api/v1/devices
GET    /api/v1/locations/provinces
GET    /api/v1/locations/provinces/:id/cities
GET    /api/v1/locations/cities/:id/barangays
```

### Agent APIs
```
POST   /api/v1/agent/auth/login
GET    /api/v1/agent/applications/search?q={query}
GET    /api/v1/agent/applications/:id
GET    /api/v1/agent/applications/by-national-id/:nationalId
PATCH  /api/v1/agent/applications/:id/review
POST   /api/v1/agent/applications/:id/approve
POST   /api/v1/agent/applications/:id/submit-to-cart
```

---

## UI/UX Requirements

### Color Scheme
- Primary: #006B54 (Smart Green)
- Secondary: #000000 (Black)
- Accent: #00C896 (Light Green)
- Background: #F5F5F5
- Error: #D32F2F
- Success: #4CAF50

### Key Components
1. **Stepper Component** - "Step X of 7" with progress bar
2. **Form Components** - Floating labels, validation messages
3. **Document Upload** - Drag-drop zone, preview thumbnails
4. **Signature Canvas** - Touch/mouse support, clear button
5. **Collapsible Sections** - Accordion for review page
6. **Modal Dialogs** - OTP input, confirmations
7. **Cards** - Product cards, summary cards

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

---

## Security Requirements

### Authentication
- **Customer**: Email OTP (6 digits, 5-min expiry, max 3 attempts)
- **Agent**: Username/password + JWT tokens
- Session management with refresh tokens

### Data Security
- HTTPS only (TLS 1.3)
- bcrypt password hashing (12 rounds)
- AES-256 encryption for sensitive data
- Encrypted document storage (S3 with server-side encryption)
- SQL injection prevention (parameterized queries)
- XSS protection (CSP headers)
- Rate limiting on all endpoints

### Validation
- Server-side validation for all inputs
- File type restrictions (.jpg, .jpeg, .png, .pdf)
- File size limit (5MB per document)
- Email format validation
- Philippine phone number format (+63)

---

## File Storage Structure

```
AWS S3 Bucket: smartify-documents
/documents/
  /{applicationId}/
    /id-front-{timestamp}.jpg
    /id-back-{timestamp}.jpg
/signatures/
  /{applicationId}/
    /signature-{timestamp}.png
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartify
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=smartify-documents

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@smartify.com

# SMS
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## Development Phases

### Phase 1: Project Setup (Week 1)
- [ ] Initialize React frontend with TypeScript
- [ ] Setup NestJS backend with TypeScript
- [ ] Configure PostgreSQL database
- [ ] Setup Prisma ORM with initial schema
- [ ] Configure AWS S3 bucket
- [ ] Setup environment variables
- [ ] Create basic folder structure

### Phase 2: Authentication & Core Features (Week 2-3)
- [ ] Implement OTP email service
- [ ] Build OTP verification flow
- [ ] Create JWT authentication middleware
- [ ] Build document upload service
- [ ] Implement signature capture
- [ ] Create location API (provinces, cities, barangays)

### Phase 3: Customer Portal (Week 4-5)
- [ ] Build step-by-step form wizard
- [ ] Implement form validation
- [ ] Create product catalog pages
- [ ] Build cart functionality
- [ ] Implement review page
- [ ] Create submission confirmation

### Phase 4: Agent Portal (Week 6)
- [ ] Build agent login
- [ ] Create agent dashboard
- [ ] Implement application search
- [ ] Build application review interface
- [ ] Create approval/rejection workflow

### Phase 5: Testing & Deployment (Week 7-8)
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] Monitoring setup

---

## Testing Checklist

### Customer Flow
- [ ] Can send and verify OTP
- [ ] Can upload documents (front and back)
- [ ] Can take photos using camera
- [ ] Can fill out address form with cascading dropdowns
- [ ] Can submit employment information
- [ ] Can sign using signature pad
- [ ] Can submit complete application
- [ ] Receives confirmation email/SMS

### Agent Flow
- [ ] Can login to agent portal
- [ ] Can search by application ID
- [ ] Can search by national ID
- [ ] Can view all application details
- [ ] Can add review notes
- [ ] Can approve/reject application
- [ ] Can submit to cart system

### Error Handling
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Large file upload rejected
- [ ] Invalid file type rejected
- [ ] Required fields validated
- [ ] Network errors handled gracefully

---

## Performance Targets

- Page load time: < 3 seconds
- API response time: < 500ms (p95)
- Document upload: < 5 seconds for 5MB file
- Support 1000 concurrent users
- Database query optimization with indexes
- Image optimization and lazy loading
- Code splitting for faster initial load

---

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (AWS ECS or Railway)
```bash
docker build -t smartify-api .
docker push smartify-api
# Deploy to ECS or Railway
```

### Database (AWS RDS or Supabase)
- PostgreSQL 15+
- Automated backups
- Read replicas for scaling

---

## Support & Maintenance

- Error monitoring: Sentry
- Logging: CloudWatch or Datadog
- Uptime monitoring: Pingdom
- Analytics: Google Analytics or Mixpanel
- Customer support integration: Zendesk or Intercom

---

**Ready to implement?** Start with Phase 1 and build incrementally!
