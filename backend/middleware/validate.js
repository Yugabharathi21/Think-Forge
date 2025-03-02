import Joi from 'joi';
import { AppError } from '../utils/errorHandler.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

// Validation schemas
const schemas = {
  // User schemas
  userRegister: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      })
  }),

  userLogin: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // Conversation schemas
  conversationCreate: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title cannot be empty',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
      }),
    settings: Joi.object({
      temperature: Joi.number()
        .min(0)
        .max(2)
        .default(0.7),
      maxTokens: Joi.number()
        .min(1)
        .max(4000)
        .default(2000),
      systemPrompt: Joi.string()
        .max(500)
        .default('You are a helpful assistant.')
    })
  }),

  messageCreate: Joi.object({
    content: Joi.string()
      .min(1)
      .max(10000)
      .required()
      .messages({
        'string.min': 'Message content cannot be empty',
        'string.max': 'Message content cannot exceed 10000 characters',
        'any.required': 'Message content is required'
      })
  }),

  // Password update/reset schemas
  passwordUpdate: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'New password is required'
      })
  }),

  passwordReset: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'Reset token is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'New password is required'
      })
  })
};

export { validate, schemas }; 