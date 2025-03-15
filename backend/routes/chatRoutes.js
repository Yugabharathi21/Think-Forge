const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  archiveConversation,
} = require('../controllers/chatController');

// All routes are protected
router.use(protect);

// Conversation routes
router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.patch('/conversations/:conversationId/archive', archiveConversation);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

module.exports = router; 