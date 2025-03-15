import express from 'express';
import { validate, schemas } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import {
  getMessages,
  createMessage,
  streamAIResponse
} from '../controllers/messageController.js';

const router = express.Router();

// Protect all routes
router.use(auth);

// Routes
router.route('/:conversationId')
  .get(getMessages)
  .post(validate(schemas.messageCreate), createMessage);

router.post('/:conversationId/generate', validate(schemas.messageCreate), streamAIResponse);

export default router;