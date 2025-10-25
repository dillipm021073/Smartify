import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./queryClient";

// Export apiRequest for direct use in components
export { apiRequest };

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Plan {
  id: string;
  name: string;
  price: string;
  durationMonths: number;
  features: {
    data?: string;
    calls?: string;
    landline?: string;
    streaming?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
  basePrice: string;
  description: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceConfiguration {
  id: string;
  deviceId: string;
  storage: string;
  color: string;
  price: string;
  isActive: boolean;
  createdAt: string;
}

export interface Province {
  id: number;
  name: string;
  regionCode: string;
}

export interface City {
  id: number;
  name: string;
  provinceId: number;
}

export interface Barangay {
  id: number;
  name: string;
  cityId: number;
  zipCode: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  cityId: number;
  barangayId: number;
  contactNumber: string;
  operatingHours: string;
  isActive: boolean;
}

export interface OtpSendResponse {
  success: boolean;
  message: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
}

export interface OrderItem {
  id: string;
  applicationId: string;
  planId: string;
  deviceId: string;
  devicePrice: string;
  planPrice: string;
  oneTimeCashout: string;
  monthlyPayment: string;
  createdAt: string;
  plan?: Plan;
  device?: Device;
}

export interface Application {
  id: string;
  cartId: string;
  email: string;
  status: string;
  simType: string;
  createdAt: string;
  updatedAt: string;
  emailVerified?: boolean;
  customerIdType?: string;
  customerIdNumber?: string;
  assignedNumber?: string;
  assignedAgentId?: string;
  storeId?: string;
  submittedAt?: string;
  orderItems?: OrderItem[];
}

export interface NetworkInfo {
  ipv4: string[];
  port: string;
  windowsIP?: string;
  isWSL: boolean;
}

// ============================================================================
// API HOOKS - NETWORK INFO
// ============================================================================

export function useNetworkInfo() {
  return useQuery<NetworkInfo>({
    queryKey: ["/api/network-info"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

// ============================================================================
// API HOOKS - PLANS
// ============================================================================

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });
}

// ============================================================================
// API HOOKS - DEVICES
// ============================================================================

export function useDevices() {
  return useQuery<Device[]>({
    queryKey: ["/api/devices"],
  });
}

export function useDeviceConfigurations(deviceId: string | null) {
  return useQuery<DeviceConfiguration[]>({
    queryKey: [`/api/devices/${deviceId}/configurations`],
    enabled: !!deviceId,
  });
}

// ============================================================================
// API HOOKS - LOCATIONS
// ============================================================================

export function useProvinces() {
  return useQuery<Province[]>({
    queryKey: ["/api/locations/provinces"],
  });
}

export function useCities(provinceId: number | null) {
  return useQuery<City[]>({
    queryKey: [`/api/locations/cities/${provinceId}`],
    enabled: !!provinceId,
  });
}

export function useBarangays(cityId: number | null) {
  return useQuery<Barangay[]>({
    queryKey: [`/api/locations/barangays/${cityId}`],
    enabled: !!cityId,
  });
}

// ============================================================================
// API HOOKS - STORES
// ============================================================================

export function useStores() {
  return useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });
}

// ============================================================================
// API HOOKS - OTP
// ============================================================================

export function useSendOtp() {
  return useMutation<OtpSendResponse, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      const res = await apiRequest("POST", "/api/otp/send", { email });
      return await res.json();
    },
  });
}

export function useVerifyOtp() {
  return useMutation<OtpVerifyResponse, Error, { email: string; otpCode: string }>({
    mutationFn: async ({ email, otpCode }) => {
      const res = await apiRequest("POST", "/api/otp/verify", { email, otpCode });
      return await res.json();
    },
  });
}

// ============================================================================
// API HOOKS - APPLICATIONS
// ============================================================================

export function useCreateApplication() {
  return useMutation<Application, Error, {
    email: string;
    simType: string;
    customerIdType?: string;
    customerIdNumber?: string;
  }>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/applications", data);
      return await res.json();
    },
  });
}

export function useGetApplication(cartId: string | null) {
  return useQuery<Application>({
    queryKey: [`/api/applications/${cartId}`],
    enabled: !!cartId,
  });
}

export function useUpdateApplication() {
  return useMutation<Application, Error, { id: string; data: Partial<Application> }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PUT", `/api/applications/${id}`, data);
      return await res.json();
    },
  });
}

export function useSubmitApplication() {
  return useMutation<{ success: boolean; message: string }, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await apiRequest("POST", `/api/applications/${id}/submit`, {});
      return await res.json();
    },
  });
}

export function useAddCustomerInformation() {
  return useMutation<void, Error, {
    applicationId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationality: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    idType: string;
    idNumber: string;
    idExpiryDate?: string;
    idFrontImage: string;
    idBackImage?: string;
  }>({
    mutationFn: async (data) => {
      const { applicationId, ...rest } = data;
      const res = await apiRequest("POST", `/api/applications/${applicationId}/customer-information`, rest);
      return await res.json();
    },
  });
}

export function useAddAddress() {
  return useMutation<void, Error, {
    applicationId: string;
    addressType: string;
    houseNumber: string;
    street: string;
    barangayId: number;
    zipCode: string;
    landmark?: string;
  }>({
    mutationFn: async (data) => {
      const { applicationId, ...rest } = data;
      const res = await apiRequest("POST", `/api/applications/${applicationId}/addresses`, rest);
      return await res.json();
    },
  });
}

export function useAddEmploymentInformation() {
  return useMutation<void, Error, {
    applicationId: string;
    employmentType: string;
    employerName?: string;
    jobTitle?: string;
    employmentStartDate?: string;
    monthlyIncome?: string;
    officeAddress?: string;
    officeContactNumber?: string;
  }>({
    mutationFn: async (data) => {
      const { applicationId, ...rest } = data;
      const res = await apiRequest("POST", `/api/applications/${applicationId}/employment`, rest);
      return await res.json();
    },
  });
}

export function useAddOrderItem() {
  return useMutation<void, Error, {
    applicationId: string;
    itemType: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    deviceConfigurationId?: string;
  }>({
    mutationFn: async (data) => {
      const { applicationId, ...rest } = data;
      const res = await apiRequest("POST", `/api/applications/${applicationId}/order-items`, rest);
      return await res.json();
    },
  });
}

export function useAddPrivacyPreferences() {
  return useMutation<void, Error, {
    applicationId: string;
    marketingEmails: boolean;
    marketingSms: boolean;
    marketingCalls: boolean;
    dataSharing: boolean;
    thirdPartySharing: boolean;
  }>({
    mutationFn: async (data) => {
      const { applicationId, ...rest } = data;
      const res = await apiRequest("POST", `/api/applications/${applicationId}/privacy-preferences`, rest);
      return await res.json();
    },
  });
}

// ============================================================================
// API HOOKS - AGENT OPERATIONS
// ============================================================================

export interface AgentLoginResponse {
  success: boolean;
  agent: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    storeId: string;
  };
}

export function useAgentLogin() {
  return useMutation<AgentLoginResponse, Error, { username: string; password: string }>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/agent/login", credentials);
      return await res.json();
    },
  });
}

export function useAgentApplications(agentId: string | null) {
  return useQuery<Application[]>({
    queryKey: [`/api/agent/applications`, { agentId }],
    queryFn: async () => {
      const url = agentId
        ? `/api/agent/applications?agentId=${agentId}`
        : '/api/agent/applications';
      const res = await apiRequest("GET", url);
      return await res.json();
    },
    enabled: !!agentId,
  });
}

export function useAgentApplicationDetails(applicationId: string | null) {
  return useQuery<Application>({
    queryKey: [`/api/agent/applications/${applicationId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agent/applications/${applicationId}`);
      return await res.json();
    },
    enabled: !!applicationId,
  });
}

export function useAssignApplication() {
  return useMutation<Application, Error, { applicationId: string; agentId: string; storeId: string }>({
    mutationFn: async ({ applicationId, agentId, storeId }) => {
      const res = await apiRequest("POST", `/api/agent/applications/${applicationId}/assign`, {
        agentId,
        storeId
      });
      return await res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the application details query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications/${variables.applicationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications`] });
    },
  });
}

export function useVerifyApplication() {
  return useMutation<Application, Error, { applicationId: string; agentId: string }>({
    mutationFn: async ({ applicationId, agentId }) => {
      const res = await apiRequest("POST", `/api/agent/applications/${applicationId}/verify`, {
        agentId
      });
      return await res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the application details query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications/${variables.applicationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications`] });
    },
  });
}

// ============================================================================
// API HOOKS - MSISDN (Phone Numbers)
// ============================================================================

export interface AvailableNumber {
  id: string;
  msisdn: string;
  status: string;
  createdAt: string;
}

export function useAvailableNumbers(limit: number = 50) {
  return useQuery<AvailableNumber[]>({
    queryKey: [`/api/msisdn/available`, { limit }],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/msisdn/available?limit=${limit}`);
      return await res.json();
    },
  });
}

export function useAssignNumber() {
  return useMutation<{ success: boolean; assignedNumber: string }, Error, { applicationId: string; msisdnId: string; agentId: string }>({
    mutationFn: async ({ applicationId, msisdnId, agentId }) => {
      const res = await apiRequest("POST", `/api/agent/applications/${applicationId}/assign-number`, {
        msisdnId,
        agentId
      });
      return await res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the application details query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications/${variables.applicationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/agent/applications`] });
    },
  });
}
