import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import {
  downloadEvalSample,
  listLlmModels,
  runLlmEvaluation,
  testLlmConfiguration,
} from "../controllers/llm.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import os from "os";

const router = express.Router();

// Use /tmp (via os.tmpdir()) for Render deployment or production
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
const evaluationDirectory = isProduction
  ? path.join(os.tmpdir(), 'krira_test')
  : path.join(process.cwd(), 'test');

if (!fs.existsSync(evaluationDirectory)) {
  try {
    fs.mkdirSync(evaluationDirectory, { recursive: true });
    console.log(`[Node] Created evaluation directory: ${evaluationDirectory}`);
  } catch (err) {
    console.error(`[Node] Failed to create evaluation directory at ${evaluationDirectory}:`, err);
    if (isProduction) {
      console.warn("[Node] Falling back to system temp directory root");
    }
  }
}

const evaluationStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, evaluationDirectory);
  },
  filename: (_req, file, callback) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9._-]+/gi, "-");
    const extension = path.extname(safeName) || ".csv";
    callback(null, `evaluation-${timestamp}${extension}`);
  },
});

const evaluationUpload = multer({
  storage: evaluationStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const isCsv =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      callback(new Error("Only CSV files are supported for evaluation"));
      return;
    }

    callback(null, true);
  },
});

router.use(authMiddleware);

router.get("/models", listLlmModels);
router.post("/test", testLlmConfiguration);
router.get("/eval/sample", downloadEvalSample);
router.post("/evaluate", (req, res, next) => {
  evaluationUpload.single("csvFile")(req, res, (error) => {
    if (error) {
      const message = error?.message ?? "Unable to upload evaluation CSV";
      return res.status(400).json({ message });
    }
    return runLlmEvaluation(req, res, next);
  });
});

export default router;
