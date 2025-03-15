import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  messageSound: {
    type: Boolean,
    default: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'zh'],
    default: 'en'
  },
  aiModel: {
    type: String,
    enum: ['mistral-7b', 'mistral-7b-instruct'],
    default: 'mistral-7b-instruct'
  },
  aiTemperature: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.7
  },
  maxTokens: {
    type: Number,
    min: 100,
    max: 4096,
    default: 2048
  }
}, {
  timestamps: true
});

export const Settings = mongoose.model('Settings', settingsSchema); 