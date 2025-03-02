import express from 'express';
import { validate, schemas } from '../middleware/validate.js';
import { auth, restrictTo } from '../middleware/auth.js';
import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation
} from '../controllers/conversationController.js';

const router = express.Router();

// Protect all routes
router.use(auth);

// Routes
router.route('/')
  .get(getConversations)
  .post(validate(schemas.conversationCreate), createConversation);

router.route('/:id')
  .get(getConversation)
  .put(validate(schemas.conversationCreate), updateConversation)
  .delete(deleteConversation);

export default router;