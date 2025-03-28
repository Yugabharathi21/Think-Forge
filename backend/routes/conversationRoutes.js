import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  archiveConversation
} from '../controllers/chatController.js';

const router = express.Router();

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`Conversation Route: ${req.method} ${req.baseUrl}${req.url}`);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  next();
});

// Apply authentication middleware to all routes
router.use(protect);

// Conversation routes
router.route('/')
  .get(getConversations)
  .post(createConversation);

// Message routes within conversations
router.route('/:conversationId/messages')
  .get(getMessages)
  .post(sendMessage);

// Archive conversation
router.route('/:conversationId/archive')
  .patch(archiveConversation);

export default router; 