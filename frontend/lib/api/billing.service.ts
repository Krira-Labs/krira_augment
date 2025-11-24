import { apiClient } from "./client";

export type PlanSummary = {
  id: string;
  name: string;
  description: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice?: number | null;
  currency: string;
  features: string[];
  comingSoon: boolean;
  billingCycle: "monthly" | "annual";
  isFree: boolean;
  requestLimit: number;
  pipelineLimit: number;
  storageLimitMb: number;
  providers: string[];
  vectorStores: string[];
  embeddingModels: string[];
};

export type BillingPlansResponse = {
  plans: PlanSummary[];
  currentPlan: {
    id: string;
    name: string;
    requestLimit: number;
    pipelineLimit: number;
    storageLimitMb: number;
    isFree: boolean;
    comingSoon: boolean;
  };
  userPlanId: string;
};

export type StripeConfigResponse = {
  publishableKey: string | null;
  enabled: boolean;
};

export const billingService = {
  async getPlans() {
    return apiClient.get<BillingPlansResponse>("/billing/plans");
  },

  async getStripeConfig() {
    return apiClient.get<StripeConfigResponse>("/billing/config");
  },

  async createCheckoutSession(planId: string) {
    return apiClient.post<{ url: string }>("/billing/checkout", { planId });
  },

  async createPortalSession() {
    return apiClient.post<{ url: string }>("/billing/portal", {});
  },

  async verifySession(sessionId: string) {
    return apiClient.post<{ success: boolean; planId: string }>("/billing/verify-session", { sessionId });
  },

  async syncSubscriptionStatus() {
    return apiClient.post<{ status: string; planId: string }>("/billing/sync", {}, { timeout: 12000 });
  },

  async cancelSubscription() {
    return apiClient.post<{ message: string; planId: string }>("/billing/cancel", {});
  },
};
