import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  decimal,
  jsonb,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// LOCATION TABLES
// ============================================================================

export const provinces = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code"),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  provinceId: integer("province_id").notNull().references(() => provinces.id),
  name: text("name").notNull(),
  code: text("code"),
});

export const barangays = pgTable("barangays", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").notNull().references(() => cities.id),
  name: text("name").notNull(),
  zipCode: text("zip_code"),
});

// ============================================================================
// STORE & AGENT TABLES
// ============================================================================

export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  cityId: integer("city_id").references(() => cities.id),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  storeId: varchar("store_id").references(() => stores.id),
  role: text("role").default("agent").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// PRODUCT TABLES (PLANS & DEVICES)
// ============================================================================

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMonths: integer("duration_months").notNull(),
  features: jsonb("features"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  images: jsonb("images"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deviceConfigurations = pgTable("device_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").notNull().references(() => devices.id),
  color: text("color"),
  storage: text("storage"),
  priceAdjustment: decimal("price_adjustment", { precision: 10, scale: 2 }).default("0").notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// ============================================================================
// APPLICATION TABLES
// ============================================================================

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cartId: varchar("cart_id").notNull().unique(),
  status: text("status").default("pending").notNull(), // pending, in_review, approved, rejected, submitted
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  // Customer identification fields (for quick search without joins)
  customerIdType: text("customer_id_type"), // passport, national_id, drivers_license, etc.
  customerIdNumber: text("customer_id_number"), // unique ID number

  assignedNumber: text("assigned_number"),
  simType: text("sim_type"), // physical, esim
  signatureUrl: text("signature_url"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  assignedAgentId: varchar("assigned_agent_id").references(() => agents.id),
  storeId: varchar("store_id").references(() => stores.id),
});

export const customerInformation = pgTable("customer_information", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().unique().references(() => applications.id, { onDelete: "cascade" }),
  idType: text("id_type").notNull(),
  idFrontUrl: text("id_front_url").notNull(),
  idBackUrl: text("id_back_url").notNull(),
  nationalId: text("national_id"),
  idVerificationStatus: text("id_verification_status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  addressType: text("address_type").notNull(), // residential, employment
  typeDetail: text("type_detail"), // house, condominium, building
  houseLotNumber: text("house_lot_number").notNull(),
  streetName: text("street_name").notNull(),
  villageSubdivision: text("village_subdivision"),
  provinceId: integer("province_id").references(() => provinces.id),
  cityId: integer("city_id").references(() => cities.id),
  barangayId: integer("barangay_id").references(() => barangays.id),
  zipCode: text("zip_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employmentInformation = pgTable("employment_information", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().unique().references(() => applications.id, { onDelete: "cascade" }),
  employmentType: text("employment_type").notNull(), // full-time, self-employed, unemployed
  employerName: text("employer_name"),
  employerContact: text("employer_contact"),
  jobTitle: text("job_title"),
  positionLevel: text("position_level"),
  monthlyIncomeRange: text("monthly_income_range"),
  employmentStartDate: timestamp("employment_start_date"),
  sameAsResidential: boolean("same_as_residential").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  planId: varchar("plan_id").notNull().references(() => plans.id),
  deviceId: varchar("device_id").notNull().references(() => devices.id),
  deviceConfigId: varchar("device_config_id").references(() => deviceConfigurations.id),
  devicePrice: decimal("device_price", { precision: 10, scale: 2 }).notNull(),
  planPrice: decimal("plan_price", { precision: 10, scale: 2 }).notNull(),
  oneTimeCashout: decimal("one_time_cashout", { precision: 10, scale: 2 }).notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const privacyPreferences = pgTable("privacy_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().unique().references(() => applications.id, { onDelete: "cascade" }),
  productOffers: boolean("product_offers").default(false).notNull(),
  trustedPartners: boolean("trusted_partners").default(false).notNull(),
  customization: boolean("customization").default(false).notNull(),
  sisterCompanies: boolean("sister_companies").default(false).notNull(),
  businessPartners: boolean("business_partners").default(false).notNull(),
  tapasilogSolutions: boolean("tapasilog_solutions").default(false).notNull(),
  termsAccepted: boolean("terms_accepted").default(false).notNull(),
  privacyNoticeAccepted: boolean("privacy_notice_accepted").default(false).notNull(),
  subscriberDeclarationAccepted: boolean("subscriber_declaration_accepted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// OTP & AUDIT TABLES
// ============================================================================

export const otpVerifications = pgTable("otp_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  otpCode: text("otp_code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => applications.id),
  agentId: varchar("agent_id").references(() => agents.id),
  action: text("action").notNull(),
  changes: jsonb("changes"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availableNumbers = pgTable("available_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  msisdn: text("msisdn").notNull().unique(), // Mobile Station International Subscriber Directory Number
  status: text("status").default("available").notNull(), // available, reserved, assigned
  reservedFor: varchar("reserved_for").references(() => applications.id),
  assignedTo: varchar("assigned_to").references(() => applications.id),
  reservedAt: timestamp("reserved_at"),
  assignedAt: timestamp("assigned_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

// Location schemas
export const selectProvinceSchema = createSelectSchema(provinces);
export const selectCitySchema = createSelectSchema(cities);
export const selectBarangaySchema = createSelectSchema(barangays);

// Store & Agent schemas
export const insertAgentSchema = createInsertSchema(agents);
export const selectAgentSchema = createSelectSchema(agents);
export const selectStoreSchema = createSelectSchema(stores);

// Product schemas
export const selectPlanSchema = createSelectSchema(plans);
export const selectDeviceSchema = createSelectSchema(devices);
export const selectDeviceConfigSchema = createSelectSchema(deviceConfigurations);

// Application schemas
export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);

export const insertCustomerInformationSchema = createInsertSchema(customerInformation);
export const insertAddressSchema = createInsertSchema(addresses);
export const insertEmploymentInformationSchema = createInsertSchema(employmentInformation);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertPrivacyPreferencesSchema = createInsertSchema(privacyPreferences);

// OTP schema
export const insertOtpSchema = createInsertSchema(otpVerifications);
export const selectOtpSchema = createSelectSchema(otpVerifications);

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type Province = typeof provinces.$inferSelect;
export type City = typeof cities.$inferSelect;
export type Barangay = typeof barangays.$inferSelect;

export type Store = typeof stores.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type Plan = typeof plans.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type DeviceConfiguration = typeof deviceConfigurations.$inferSelect;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type CustomerInformation = typeof customerInformation.$inferSelect;
export type InsertCustomerInformation = z.infer<typeof insertCustomerInformationSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

export type EmploymentInformation = typeof employmentInformation.$inferSelect;
export type InsertEmploymentInformation = z.infer<typeof insertEmploymentInformationSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type PrivacyPreferences = typeof privacyPreferences.$inferSelect;
export type InsertPrivacyPreferences = z.infer<typeof insertPrivacyPreferencesSchema>;

export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;

export type AvailableNumber = typeof availableNumbers.$inferSelect;
export const insertAvailableNumberSchema = createInsertSchema(availableNumbers);
export const selectAvailableNumberSchema = createSelectSchema(availableNumbers);
export type InsertAvailableNumber = z.infer<typeof insertAvailableNumberSchema>;
