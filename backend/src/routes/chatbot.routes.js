import express from "express";
import {
    createChatbot,
    getChatbot,
    updateChatbot,
    addTestResult,
    getAllChatbots,
    deleteChatbot,
    completeChatbot,
} from "../controllers/chatbot.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllChatbots); // Get all user's chatbots
router.post("/", createChatbot);
router.get("/:id", getChatbot);
router.put("/:id", updateChatbot);
router.delete("/:id", deleteChatbot); // Delete chatbot
router.post("/:id/test-result", addTestResult);
router.post("/:id/complete", completeChatbot);

export default router;
