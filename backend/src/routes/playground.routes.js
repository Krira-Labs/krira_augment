import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  playgroundChat,
  getPlaygroundHistory,
  clearPlaygroundHistory,
} from '../controllers/playground.controller.js';

const router = express.Router();

// Chat with chatbot in playground
router.post('/chat', authMiddleware, playgroundChat);

// Get chat history for a session
router.get('/history/:chatbotId/:sessionId', authMiddleware, getPlaygroundHistory);

// Clear chat history for a session
router.delete('/history/:chatbotId/:sessionId', authMiddleware, clearPlaygroundHistory);

export default router;
