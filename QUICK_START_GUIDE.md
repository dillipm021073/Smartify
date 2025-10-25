# Smartify - Quick Start Guide

This guide will help you set up and run the Smartify SIM with Device application locally.

---

## Prerequisites

Ensure you have the following installed:
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis (optional, for caching)
- Git
- AWS Account (for S3) or local file storage alternative

---

## Project Structure

```
smartify/
├── frontend/           # React TypeScript application
├── backend/            # NestJS/Express API
├── database/           # Database migrations and seeds
├── docs/              # Documentation
└── docker-compose.yml # Local development setup
```

---

## Option 1: Quick Setup with Docker

### 1. Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: smartify
      POSTGRES_USER: smartify_user
      POSTGRES_PASSWORD: smartify_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://smartify_user:smartify_password@postgres:5432/smartify
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-development-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

### 2. Start All Services

```bash
docker-compose up -d
```

---

## Option 2: Manual Setup

### Step 1: Setup PostgreSQL Database

```bash
# Start PostgreSQL
# On Mac: brew services start postgresql
# On Linux: sudo service postgresql start
# On Windows: Use PostgreSQL installer

# Create database
createdb smartify

# Or using psql
psql -U postgres
CREATE DATABASE smartify;
CREATE USER smartify_user WITH PASSWORD 'smartify_password';
GRANT ALL PRIVILEGES ON DATABASE smartify TO smartify_user;
\q
```

### Step 2: Setup Backend

```bash
# Create backend directory
mkdir backend && cd backend

# Initialize NestJS project
npm i -g @nestjs/cli
nest new . --package-manager npm

# Install dependencies
npm install --save @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer @nestjs/config @nestjs/swagger aws-sdk multer @nestjs/throttler nodemailer redis

npm install --save-dev @types/bcrypt @types/passport-jwt @types/multer @types/nodemailer prisma

# Initialize Prisma
npx prisma init

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://smartify_user:smartify_password@localhost:5432/smartify"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRY="1h"
REFRESH_TOKEN_EXPIRY="7d"

# AWS S3 (or use local storage for development)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="smartify-documents-dev"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@smartify.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Redis
REDIS_URL="redis://localhost:6379"

# App Config
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
EOF
```

### Step 3: Create Database Schema with Prisma

```bash
# Edit prisma/schema.prisma
```

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Application {
  id                String   @id @default(uuid())
  cartId            String   @unique @map("cart_id")
  status            String   @default("pending")
  email             String
  emailVerified     Boolean  @default(false) @map("email_verified")
  assignedNumber    String?  @map("assigned_number")
  simType           String?  @map("sim_type")
  signatureUrl      String?  @map("signature_url")
  submittedAt       DateTime? @map("submitted_at")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  assignedAgentId   String?  @map("assigned_agent_id")
  storeId           String?  @map("store_id")

  customerInfo      CustomerInformation?
  addresses         Address[]
  employmentInfo    EmploymentInformation?
  orderItems        OrderItem[]
  privacyPrefs      PrivacyPreferences?
  auditLogs         AuditLog[]

  agent             Agent?   @relation(fields: [assignedAgentId], references: [id])
  store             Store?   @relation(fields: [storeId], references: [id])

  @@index([cartId])
  @@index([email])
  @@index([status])
  @@map("applications")
}

model CustomerInformation {
  id                    String   @id @default(uuid())
  applicationId         String   @unique @map("application_id")
  idType                String   @map("id_type")
  idFrontUrl            String   @map("id_front_url")
  idBackUrl             String   @map("id_back_url")
  nationalId            String?  @map("national_id")
  idVerificationStatus  String   @default("pending") @map("id_verification_status")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  application           Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@index([nationalId])
  @@map("customer_information")
}

model Address {
  id                String   @id @default(uuid())
  applicationId     String   @map("application_id")
  addressType       String   @map("address_type")
  typeDetail        String?  @map("type_detail")
  houseLotNumber    String   @map("house_lot_number")
  streetName        String   @map("street_name")
  villageSubdivision String? @map("village_subdivision")
  provinceId        Int?     @map("province_id")
  cityId            Int?     @map("city_id")
  barangayId        Int?     @map("barangay_id")
  zipCode           String?  @map("zip_code")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  application       Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  province          Province?   @relation(fields: [provinceId], references: [id])
  city              City?       @relation(fields: [cityId], references: [id])
  barangay          Barangay?   @relation(fields: [barangayId], references: [id])

  @@map("addresses")
}

model EmploymentInformation {
  id                   String    @id @default(uuid())
  applicationId        String    @unique @map("application_id")
  employmentType       String    @map("employment_type")
  employerName         String?   @map("employer_name")
  employerContact      String?   @map("employer_contact")
  jobTitle             String?   @map("job_title")
  positionLevel        String?   @map("position_level")
  monthlyIncomeRange   String?   @map("monthly_income_range")
  employmentStartDate  DateTime? @map("employment_start_date")
  sameAsResidential    Boolean   @default(false) @map("same_as_residential")
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  application          Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@map("employment_information")
}

model Plan {
  id              String   @id @default(uuid())
  name            String
  price           Decimal  @db.Decimal(10, 2)
  durationMonths  Int      @map("duration_months")
  features        Json?
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  orderItems      OrderItem[]

  @@map("plans")
}

model Device {
  id          String   @id @default(uuid())
  name        String
  brand       String
  model       String
  basePrice   Decimal  @db.Decimal(10, 2) @map("base_price")
  description String?
  images      Json?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  configurations DeviceConfiguration[]
  orderItems     OrderItem[]

  @@map("devices")
}

model DeviceConfiguration {
  id              String   @id @default(uuid())
  deviceId        String   @map("device_id")
  color           String?
  storage         String?
  priceAdjustment Decimal  @default(0) @db.Decimal(10, 2) @map("price_adjustment")
  stockQuantity   Int      @default(0) @map("stock_quantity")
  isActive        Boolean  @default(true) @map("is_active")

  device          Device   @relation(fields: [deviceId], references: [id])
  orderItems      OrderItem[]

  @@map("device_configurations")
}

model OrderItem {
  id              String   @id @default(uuid())
  applicationId   String   @map("application_id")
  planId          String   @map("plan_id")
  deviceId        String   @map("device_id")
  deviceConfigId  String?  @map("device_config_id")
  devicePrice     Decimal  @db.Decimal(10, 2) @map("device_price")
  planPrice       Decimal  @db.Decimal(10, 2) @map("plan_price")
  oneTimeCashout  Decimal  @db.Decimal(10, 2) @map("one_time_cashout")
  monthlyPayment  Decimal  @db.Decimal(10, 2) @map("monthly_payment")
  createdAt       DateTime @default(now()) @map("created_at")

  application     Application          @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  plan            Plan                 @relation(fields: [planId], references: [id])
  device          Device               @relation(fields: [deviceId], references: [id])
  deviceConfig    DeviceConfiguration? @relation(fields: [deviceConfigId], references: [id])

  @@map("order_items")
}

model Province {
  id        Int      @id @default(autoincrement())
  name      String
  code      String?

  cities    City[]
  addresses Address[]

  @@map("provinces")
}

model City {
  id          Int      @id @default(autoincrement())
  provinceId  Int      @map("province_id")
  name        String
  code        String?

  province    Province   @relation(fields: [provinceId], references: [id])
  barangays   Barangay[]
  addresses   Address[]

  @@map("cities")
}

model Barangay {
  id        Int      @id @default(autoincrement())
  cityId    Int      @map("city_id")
  name      String
  zipCode   String?  @map("zip_code")

  city      City     @relation(fields: [cityId], references: [id])
  addresses Address[]

  @@map("barangays")
}

model Store {
  id           String        @id @default(uuid())
  name         String
  cityId       Int?          @map("city_id")
  address      String?
  isActive     Boolean       @default(true) @map("is_active")

  applications Application[]
  agents       Agent[]

  @@map("stores")
}

model Agent {
  id           String        @id @default(uuid())
  username     String        @unique
  email        String        @unique
  passwordHash String        @map("password_hash")
  fullName     String?       @map("full_name")
  storeId      String?       @map("store_id")
  role         String        @default("agent")
  isActive     Boolean       @default(true) @map("is_active")
  createdAt    DateTime      @default(now()) @map("created_at")

  store        Store?        @relation(fields: [storeId], references: [id])
  applications Application[]
  auditLogs    AuditLog[]

  @@map("agents")
}

model PrivacyPreferences {
  id                         String      @id @default(uuid())
  applicationId              String      @unique @map("application_id")
  productOffers              Boolean     @default(false) @map("product_offers")
  trustedPartners            Boolean     @default(false) @map("trusted_partners")
  customization              Boolean     @default(false)
  sisterCompanies            Boolean     @default(false) @map("sister_companies")
  businessPartners           Boolean     @default(false) @map("business_partners")
  tapasilogSolutions         Boolean     @default(false) @map("tapasilog_solutions")
  termsAccepted              Boolean     @default(false) @map("terms_accepted")
  privacyNoticeAccepted      Boolean     @default(false) @map("privacy_notice_accepted")
  subscriberDeclarationAccepted Boolean  @default(false) @map("subscriber_declaration_accepted")
  createdAt                  DateTime    @default(now()) @map("created_at")

  application                Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@map("privacy_preferences")
}

model AuditLog {
  id            String   @id @default(uuid())
  applicationId String?  @map("application_id")
  agentId       String?  @map("agent_id")
  action        String
  changes       Json?
  ipAddress     String?  @map("ip_address")
  createdAt     DateTime @default(now()) @map("created_at")

  application   Application? @relation(fields: [applicationId], references: [id])
  agent         Agent?       @relation(fields: [agentId], references: [id])

  @@map("audit_logs")
}

model OtpVerification {
  id        String   @id @default(uuid())
  email     String
  otpCode   String   @map("otp_code")
  expiresAt DateTime @map("expires_at")
  verified  Boolean  @default(false)
  attempts  Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")

  @@index([email])
  @@index([expiresAt])
  @@map("otp_verifications")
}
```

```bash
# Generate Prisma Client and run migrations
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Create Seed Data (Optional)

```bash
# Create seed file
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed Provinces, Cities, Barangays (sample data)
  const metroManila = await prisma.province.create({
    data: {
      name: 'Metro Manila',
      code: 'NCR',
    },
  });

  const quezonCity = await prisma.city.create({
    data: {
      name: 'Quezon City',
      provinceId: metroManila.id,
      code: 'QC',
    },
  });

  await prisma.barangay.createMany({
    data: [
      { name: 'Barangay 1', cityId: quezonCity.id, zipCode: '1100' },
      { name: 'Barangay 2', cityId: quezonCity.id, zipCode: '1101' },
    ],
  });

  // Seed Store
  const mainStore = await prisma.store.create({
    data: {
      name: 'Main Store - Quezon City',
      cityId: quezonCity.id,
      address: 'Sample Address, Quezon City',
    },
  });

  // Seed Agent
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.agent.create({
    data: {
      username: 'admin',
      email: 'admin@smartify.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      storeId: mainStore.id,
      role: 'admin',
    },
  });

  // Seed Plans
  await prisma.plan.createMany({
    data: [
      {
        name: 'PLAN 1299',
        price: 1299,
        durationMonths: 12,
        features: {
          data: '25GB',
          validity: '12 months',
          calls: 'Unli All-Net',
        },
      },
      {
        name: 'PLAN 2999',
        price: 2999,
        durationMonths: 24,
        features: {
          data: 'Unli Data',
          validity: '24 months',
          calls: 'Unli All-Net',
        },
      },
    ],
  });

  // Seed Devices
  const device = await prisma.device.create({
    data: {
      name: 'iPhone 17 Pro Max',
      brand: 'Apple',
      model: 'iPhone 17 Pro Max',
      basePrice: 89990,
      description: 'The ultimate iPhone with the most advanced technology',
      images: ['iphone-17-pro-max.jpg'],
    },
  });

  // Seed Device Configurations
  await prisma.deviceConfiguration.createMany({
    data: [
      { deviceId: device.id, color: 'Deep Blue', storage: '128GB', priceAdjustment: 0, stockQuantity: 10 },
      { deviceId: device.id, color: 'Deep Blue', storage: '256GB', priceAdjustment: 5000, stockQuantity: 8 },
      { deviceId: device.id, color: 'Orange', storage: '128GB', priceAdjustment: 0, stockQuantity: 12 },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Run seed
npx ts-node prisma/seed.ts
```

### Step 5: Setup Frontend

```bash
# Create frontend directory
cd ../
npx create-react-app frontend --template typescript
cd frontend

# Install dependencies
npm install react-router-dom@6 axios @tanstack/react-query react-hook-form yup @hookform/resolvers zustand react-signature-canvas react-dropzone date-fns

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Material-UI (optional)
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_ENVIRONMENT=development
EOF
```

### Step 6: Run the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run start:dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

The application should now be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs (if Swagger is configured)

---

## Default Credentials

### Agent Login
- Username: `admin`
- Password: `admin123`
- Email: `admin@smartify.com`

---

## Useful Commands

### Backend

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Frontend

```bash
# Development
npm start

# Build
npm run build

# Test
npm test

# Eject (not recommended)
npm run eject
```

---

## Testing the Application

### Test Customer Flow

1. **Go to** http://localhost:3000
2. **Enter email** and request OTP
3. **Check console** for OTP code (in development mode)
4. **Verify OTP** and proceed through the form steps
5. **Upload documents** (use sample ID images)
6. **Fill address** information
7. **Submit employment** details
8. **Review** application
9. **Sign** and submit

### Test Agent Flow

1. **Go to** http://localhost:3000/agent/login
2. **Login** with admin credentials
3. **Search** for application by Cart ID or National ID
4. **Review** application details
5. **Approve/Reject** application

---

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
# Make sure DATABASE_URL is correct
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
npx prisma generate
```

### CORS Error
```bash
# Make sure CORS is enabled in backend
# Check that FRONTEND_URL in backend .env matches your frontend URL
```

---

## Next Steps

1. **Implement remaining features** from TECHNICAL_SPECIFICATION.md
2. **Add comprehensive tests**
3. **Configure AWS S3** for document storage
4. **Setup SendGrid/Twilio** for OTP
5. **Implement file upload** with validation
6. **Add signature canvas** functionality
7. **Build agent dashboard**
8. **Deploy to production**

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material-UI Documentation](https://mui.com/)

---

**Happy Coding!** 🚀
