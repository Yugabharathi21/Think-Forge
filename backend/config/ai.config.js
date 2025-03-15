import dotenv from 'dotenv';
dotenv.config();

export const AI_CONFIG = {
  model: {
    name: 'mistral-7b-instruct',
    baseUrl: process.env.MISTRAL_API_URL || 'http://localhost:8000',
    apiKey: process.env.MISTRAL_API_KEY,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
    streamingEnabled: true,
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // requests per minute
  },
  contextWindow: {
    maxMessages: 10, // maximum number of messages to include in context
    maxTokensPerMessage: 1000 // maximum tokens per message
  }
}; 