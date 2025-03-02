import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email) {
        return next(new AppError('Email already in use', 400, { field: 'email' }));
      }
      return next(new AppError('Username already taken', 400, { field: 'username' }));
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token using the model method
    const token = user.generateAuthToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid credentials', 401, { field: 'email' }));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new AppError('Your account is not active', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401, { field: 'password' }));
    }

    // Generate token using the model method
    const token = user.generateAuthToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.preferences = {
      ...user.preferences,
      ...req.body
    };

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};