import express from "express";

import { createApiKey, listApiKeys, revokeApiKey, verifyApiKey } from "../controllers/apiKey.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { serviceAuthMiddleware } from "../middlewares/serviceAuth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, listApiKeys);
router.post("/", authMiddleware, createApiKey);
router.delete("/:keyId", authMiddleware, revokeApiKey);

router.post("/verify", serviceAuthMiddleware, verifyApiKey);

export default router;
