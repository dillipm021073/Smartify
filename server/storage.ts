import { eq, and, desc, or, like, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import type {
  Province,
  City,
  Barangay,
  Plan,
  Device,
  DeviceConfiguration,
  Store,
  Agent,
  InsertAgent,
  Application,
  InsertApplication,
  InsertCustomerInformation,
  InsertAddress,
  InsertEmploymentInformation,
  InsertOrderItem,
  InsertPrivacyPreferences,
  OtpVerification,
  InsertOtp,
  AvailableNumber,
} from "@shared/schema";

export interface IStorage {
  // ============================================================================
  // LOCATION OPERATIONS
  // ============================================================================
  getAllProvinces(): Promise<Province[]>;
  getCitiesByProvince(provinceId: number): Promise<City[]>;
  getBarangaysByCity(cityId: number): Promise<Barangay[]>;
  getBarangayById(barangayId: number): Promise<Barangay | undefined>;

  // ============================================================================
  // PLAN & DEVICE OPERATIONS
  // ============================================================================
  getAllPlans(): Promise<Plan[]>;
  getPlanById(id: string): Promise<Plan | undefined>;

  getAllDevices(): Promise<Device[]>;
  getDeviceById(id: string): Promise<Device | undefined>;
  getDeviceConfigurationsByDevice(deviceId: string): Promise<DeviceConfiguration[]>;
  getDeviceConfigurationById(id: string): Promise<DeviceConfiguration | undefined>;

  // ============================================================================
  // STORE OPERATIONS
  // ============================================================================
  getAllStores(): Promise<Store[]>;
  getStoreById(id: string): Promise<Store | undefined>;

  // ============================================================================
  // AGENT OPERATIONS
  // ============================================================================
  getAgentByUsername(username: string): Promise<Agent | undefined>;
  getAgentByEmail(email: string): Promise<Agent | undefined>;
  getAgentById(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;

  // ============================================================================
  // APPLICATION OPERATIONS
  // ============================================================================
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationById(id: string): Promise<Application | undefined>;
  getApplicationByCartId(cartId: string): Promise<Application | undefined>;
  getPendingApplicationByEmail(email: string): Promise<Application | undefined>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;
  updateApplication(id: string, data: Partial<Application>): Promise<Application | undefined>;
  searchApplications(searchTerm: string): Promise<Application[]>;
  getApplicationsByStatus(status: string): Promise<Application[]>;

  // Customer Information
  createCustomerInformation(data: InsertCustomerInformation): Promise<void>;
  getCustomerInformationByApplicationId(applicationId: string): Promise<any>;

  // Address
  createAddress(data: InsertAddress): Promise<void>;
  getAddressesByApplicationId(applicationId: string): Promise<any[]>;

  // Employment Information
  createEmploymentInformation(data: InsertEmploymentInformation): Promise<void>;
  getEmploymentInformationByApplicationId(applicationId: string): Promise<any>;

  // Order Items
  createOrderItem(data: InsertOrderItem): Promise<void>;
  getOrderItemsByApplicationId(applicationId: string): Promise<any[]>;

  // Privacy Preferences
  createPrivacyPreferences(data: InsertPrivacyPreferences): Promise<void>;
  getPrivacyPreferencesByApplicationId(applicationId: string): Promise<any>;

  // ============================================================================
  // OTP OPERATIONS
  // ============================================================================
  createOtp(data: InsertOtp): Promise<OtpVerification>;
  getOtpByEmail(email: string): Promise<OtpVerification | undefined>;
  verifyOtp(email: string, otpCode: string): Promise<boolean>;
  incrementOtpAttempts(id: string): Promise<void>;
  markOtpAsVerified(id: string): Promise<void>;

  // ============================================================================
  // AUDIT LOG OPERATIONS
  // ============================================================================
  createAuditLog(data: {
    applicationId?: string;
    agentId?: string;
    action: string;
    changes?: any;
    ipAddress?: string;
  }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ============================================================================
  // LOCATION OPERATIONS
  // ============================================================================

  async getAllProvinces(): Promise<Province[]> {
    return await db.select().from(schema.provinces);
  }

  async getCitiesByProvince(provinceId: number): Promise<City[]> {
    return await db
      .select()
      .from(schema.cities)
      .where(eq(schema.cities.provinceId, provinceId));
  }

  async getBarangaysByCity(cityId: number): Promise<Barangay[]> {
    return await db
      .select()
      .from(schema.barangays)
      .where(eq(schema.barangays.cityId, cityId));
  }

  async getBarangayById(barangayId: number): Promise<Barangay | undefined> {
    const result = await db
      .select()
      .from(schema.barangays)
      .where(eq(schema.barangays.id, barangayId))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // PLAN & DEVICE OPERATIONS
  // ============================================================================

  async getAllPlans(): Promise<Plan[]> {
    return await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.isActive, true));
  }

  async getPlanById(id: string): Promise<Plan | undefined> {
    const result = await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.id, id))
      .limit(1);
    return result[0];
  }

  async getAllDevices(): Promise<Device[]> {
    return await db
      .select()
      .from(schema.devices)
      .where(eq(schema.devices.isActive, true));
  }

  async getDeviceById(id: string): Promise<Device | undefined> {
    const result = await db
      .select()
      .from(schema.devices)
      .where(eq(schema.devices.id, id))
      .limit(1);
    return result[0];
  }

  async getDeviceConfigurationsByDevice(deviceId: string): Promise<DeviceConfiguration[]> {
    return await db
      .select()
      .from(schema.deviceConfigurations)
      .where(
        and(
          eq(schema.deviceConfigurations.deviceId, deviceId),
          eq(schema.deviceConfigurations.isActive, true)
        )
      );
  }

  async getDeviceConfigurationById(id: string): Promise<DeviceConfiguration | undefined> {
    const result = await db
      .select()
      .from(schema.deviceConfigurations)
      .where(eq(schema.deviceConfigurations.id, id))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // STORE OPERATIONS
  // ============================================================================

  async getAllStores(): Promise<Store[]> {
    return await db
      .select()
      .from(schema.stores)
      .where(eq(schema.stores.isActive, true));
  }

  async getStoreById(id: string): Promise<Store | undefined> {
    const result = await db
      .select()
      .from(schema.stores)
      .where(eq(schema.stores.id, id))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // AGENT OPERATIONS
  // ============================================================================

  async getAgentByUsername(username: string): Promise<Agent | undefined> {
    const result = await db
      .select()
      .from(schema.agents)
      .where(eq(schema.agents.username, username))
      .limit(1);
    return result[0];
  }

  async getAgentByEmail(email: string): Promise<Agent | undefined> {
    const result = await db
      .select()
      .from(schema.agents)
      .where(eq(schema.agents.email, email))
      .limit(1);
    return result[0];
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    const result = await db
      .select()
      .from(schema.agents)
      .where(eq(schema.agents.id, id))
      .limit(1);
    return result[0];
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const result = await db
      .insert(schema.agents)
      .values(agent)
      .returning();
    return result[0];
  }

  // ============================================================================
  // APPLICATION OPERATIONS
  // ============================================================================

  async createApplication(application: InsertApplication): Promise<Application> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    const result = await db
      .insert(schema.applications)
      .values({
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...application
      })
      .returning();
    return result[0];
  }

  async getApplicationById(id: string): Promise<Application | undefined> {
    const result = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.id, id))
      .limit(1);
    return result[0];
  }

  async getApplicationByCartId(cartId: string): Promise<Application | undefined> {
    const result = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.cartId, cartId))
      .limit(1);
    return result[0];
  }

  async getPendingApplicationByEmail(email: string): Promise<Application | undefined> {
    const result = await db
      .select()
      .from(schema.applications)
      .where(
        and(
          eq(schema.applications.email, email),
          eq(schema.applications.status, "pending")
        )
      )
      .limit(1);
    return result[0];
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const result = await db
      .update(schema.applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.applications.id, id))
      .returning();
    return result[0];
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application | undefined> {
    const result = await db
      .update(schema.applications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.applications.id, id))
      .returning();
    return result[0];
  }

  async searchApplications(searchTerm: string): Promise<Application[]> {
    return await db
      .select()
      .from(schema.applications)
      .where(
        or(
          like(schema.applications.cartId, `%${searchTerm}%`),
          like(schema.applications.email, `%${searchTerm}%`),
          like(schema.applications.customerIdNumber, `%${searchTerm}%`)
        )
      )
      .orderBy(desc(schema.applications.createdAt));
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    return await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.status, status))
      .orderBy(desc(schema.applications.createdAt));
  }

  async getApplicationsForAgent(agentId: string): Promise<Application[]> {
    // Get applications that are:
    // 1. "pending" status (not assigned to anyone yet - available to pick up)
    // 2. "submitted" or "verified" status AND assigned to this specific agent
    // 3. "submitted" status with NO assigned agent (orphaned - treat as pending)
    return await db
      .select()
      .from(schema.applications)
      .where(
        or(
          eq(schema.applications.status, "pending"),
          and(
            or(
              eq(schema.applications.status, "submitted"),
              eq(schema.applications.status, "verified")
            ),
            eq(schema.applications.assignedAgentId, agentId)
          ),
          // Handle orphaned "submitted" applications (no agent assigned)
          and(
            eq(schema.applications.status, "submitted"),
            sql`${schema.applications.assignedAgentId} IS NULL`
          )
        )
      )
      .orderBy(desc(schema.applications.createdAt));
  }

  // ============================================================================
  // CUSTOMER INFORMATION
  // ============================================================================

  async createCustomerInformation(data: InsertCustomerInformation): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.customerInformation).values({
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data
    });
  }

  async getCustomerInformationByApplicationId(applicationId: string): Promise<any> {
    const result = await db
      .select()
      .from(schema.customerInformation)
      .where(eq(schema.customerInformation.applicationId, applicationId))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // ADDRESS
  // ============================================================================

  async createAddress(data: InsertAddress): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.addresses).values({
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data
    });
  }

  async getAddressesByApplicationId(applicationId: string): Promise<any[]> {
    return await db
      .select()
      .from(schema.addresses)
      .where(eq(schema.addresses.applicationId, applicationId));
  }

  // ============================================================================
  // EMPLOYMENT INFORMATION
  // ============================================================================

  async createEmploymentInformation(data: InsertEmploymentInformation): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.employmentInformation).values({
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data
    });
  }

  async getEmploymentInformationByApplicationId(applicationId: string): Promise<any> {
    const result = await db
      .select()
      .from(schema.employmentInformation)
      .where(eq(schema.employmentInformation.applicationId, applicationId))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // ORDER ITEMS
  // ============================================================================

  async createOrderItem(data: InsertOrderItem): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.orderItems).values({
      id: randomUUID(),
      createdAt: now,
      ...data
    });
  }

  async getOrderItemsByApplicationId(applicationId: string): Promise<any[]> {
    return await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.applicationId, applicationId));
  }

  // ============================================================================
  // PRIVACY PREFERENCES
  // ============================================================================

  async createPrivacyPreferences(data: InsertPrivacyPreferences): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.privacyPreferences).values({
      id: randomUUID(),
      createdAt: now,
      ...data
    });
  }

  async getPrivacyPreferencesByApplicationId(applicationId: string): Promise<any> {
    const result = await db
      .select()
      .from(schema.privacyPreferences)
      .where(eq(schema.privacyPreferences.applicationId, applicationId))
      .limit(1);
    return result[0];
  }

  // ============================================================================
  // OTP OPERATIONS
  // ============================================================================

  async createOtp(data: InsertOtp): Promise<OtpVerification> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    const result = await db
      .insert(schema.otpVerifications)
      .values({
        id: randomUUID(),
        createdAt: now,
        ...data
      })
      .returning();
    return result[0];
  }

  async getOtpByEmail(email: string): Promise<OtpVerification | undefined> {
    const result = await db
      .select()
      .from(schema.otpVerifications)
      .where(
        and(
          eq(schema.otpVerifications.email, email),
          eq(schema.otpVerifications.verified, false)
        )
      )
      .orderBy(desc(schema.otpVerifications.createdAt))
      .limit(1);
    return result[0];
  }

  async verifyOtp(email: string, otpCode: string): Promise<boolean> {
    const otp = await this.getOtpByEmail(email);

    if (!otp) {
      return false;
    }

    // Check if OTP is expired
    if (new Date() > otp.expiresAt) {
      return false;
    }

    // Check if max attempts exceeded
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || "3");
    if (otp.attempts >= maxAttempts) {
      return false;
    }

    // Verify OTP code
    if (otp.otpCode !== otpCode) {
      await this.incrementOtpAttempts(otp.id);
      return false;
    }

    // Mark as verified
    await this.markOtpAsVerified(otp.id);
    return true;
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await db
      .update(schema.otpVerifications)
      .set({ attempts: sql`${schema.otpVerifications.attempts} + 1` })
      .where(eq(schema.otpVerifications.id, id));
  }

  async markOtpAsVerified(id: string): Promise<void> {
    await db
      .update(schema.otpVerifications)
      .set({ verified: true })
      .where(eq(schema.otpVerifications.id, id));
  }

  // ============================================================================
  // AUDIT LOG OPERATIONS
  // ============================================================================

  async createAuditLog(data: {
    applicationId?: string;
    agentId?: string;
    action: string;
    changes?: any;
    ipAddress?: string;
  }): Promise<void> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    await db.insert(schema.auditLogs).values({
      id: randomUUID(),
      createdAt: now,
      ...data
    });
  }

  // ============================================================================
  // MSISDN (Phone Number) OPERATIONS
  // ============================================================================

  async getAvailableNumbers(limit: number = 50): Promise<AvailableNumber[]> {
    const result = await db
      .select()
      .from(schema.availableNumbers)
      .where(eq(schema.availableNumbers.status, "available"))
      .limit(limit);
    return result;
  }

  async getNumberById(id: string): Promise<AvailableNumber | undefined> {
    const result = await db
      .select()
      .from(schema.availableNumbers)
      .where(eq(schema.availableNumbers.id, id))
      .limit(1);
    return result[0];
  }

  async assignNumberToApplication(numberId: string, applicationId: string): Promise<void> {
    const now = new Date();
    await db
      .update(schema.availableNumbers)
      .set({
        status: "assigned",
        assignedTo: applicationId,
        assignedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.availableNumbers.id, numberId));
  }

  async createAvailableNumber(data: {
    msisdn: string;
  }): Promise<AvailableNumber> {
    const { randomUUID } = await import("crypto");
    const now = new Date();
    const result = await db
      .insert(schema.availableNumbers)
      .values({
        id: randomUUID(),
        msisdn: data.msisdn,
        status: "available",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
