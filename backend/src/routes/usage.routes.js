import express from "express";

import { getUsageSummary } from "../controllers/usage.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getUsageSummary);

export default router;
