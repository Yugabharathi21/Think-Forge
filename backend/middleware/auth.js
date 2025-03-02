import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

// Middleware to protect routes
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next(new AppError('No token, authorization denied', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id and check status
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new AppError('Your account is not active', 401));
    }

    // Check if token was issued before password change
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      return next(new AppError('Password was recently changed. Please log in again', 401));
    }
    
    // Add user to request
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(new AppError('Authentication failed', 401));
  }
};

// Middleware to restrict access by role
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};