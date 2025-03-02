import express from 'express';
import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation
} from '../controllers/conversationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getConversations)
  .post(createConversation);

router.route('/:id')
  .get(getConversation)
  .put(updateConversation)
  .delete(deleteConversation);

export default router;