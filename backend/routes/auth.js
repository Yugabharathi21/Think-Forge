import express from 'express';
import { validate, schemas } from '../middleware/validate.js';
import { auth, restrictTo } from '../middleware/auth.js';
import {
  register,
  login,
  getCurrentUser,
  updatePreferences
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', validate(schemas.userRegister), register);
router.post('/login', validate(schemas.userLogin), login);

// Protected routes
router.use(auth);
router.get('/me', getCurrentUser);
router.patch('/preferences', validate(schemas.userPreferences), updatePreferences);

export default router;