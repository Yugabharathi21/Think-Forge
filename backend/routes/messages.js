import express from 'express';
import {
  getMessages,
  createMessage,
  generateAIResponse
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all messages for a conversation
router.get('/:conversationId', getMessages);

// Create a new message
router.post('/:conversationId', createMessage);

// Generate AI response
router.post('/:conversationId/generate', generateAIResponse);

export default router;