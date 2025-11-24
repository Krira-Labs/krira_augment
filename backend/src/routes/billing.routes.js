import express from "express";

import {
  createCheckoutSession,
  createPortalSession,
  getBillingPlans,
  getStripeConfig,
  syncSubscriptionStatus,
  verifyCheckoutSession,
  cancelSubscription,
} from "../controllers/billing.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/plans", getBillingPlans);
router.get("/config", getStripeConfig);
router.post("/checkout", createCheckoutSession);
router.post("/portal", createPortalSession);
router.post("/verify-session", verifyCheckoutSession);
router.post("/sync", syncSubscriptionStatus);
router.post("/cancel", cancelSubscription);

export default router;
