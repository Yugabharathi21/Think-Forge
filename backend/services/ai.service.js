import axios from 'axios';
import { AI_CONFIG } from '../config/ai.config.js';

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: AI_CONFIG.model.baseUrl,
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.model.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateResponse(messages, options = {}) {
    try {
      const response = await this.client.post('/v1/chat/completions', {
        model: AI_CONFIG.model.name,
        messages: this._formatMessages(messages),
        max_tokens: options.maxTokens || AI_CONFIG.model.maxTokens,
        temperature: options.temperature || AI_CONFIG.model.temperature,
        top_p: options.topP || AI_CONFIG.model.topP,
        stream: options.stream || AI_CONFIG.model.streamingEnabled
      });

      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateStreamResponse(messages, onData, options = {}) {
    try {
      const response = await this.client.post('/v1/chat/completions', {
        model: AI_CONFIG.model.name,
        messages: this._formatMessages(messages),
        max_tokens: options.maxTokens || AI_CONFIG.model.maxTokens,
        temperature: options.temperature || AI_CONFIG.model.temperature,
        top_p: options.topP || AI_CONFIG.model.topP,
        stream: true
      }, {
        responseType: 'stream'
      });

      response.data.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            onData(data.choices[0].delta.content);
          }
        }
      });

      return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    } catch (error) {
      console.error('AI Streaming Error:', error.response?.data || error.message);
      throw new Error('Failed to generate streaming AI response');
    }
  }

  _formatMessages(messages) {
    return messages.slice(-AI_CONFIG.contextWindow.maxMessages).map(msg => ({
      role: msg.role,
      content: msg.content.slice(0, AI_CONFIG.contextWindow.maxTokensPerMessage)
    }));
  }

  async generateEmbedding(text) {
    try {
      const response = await this.client.post('/v1/embeddings', {
        model: 'mistral-embed',
        input: text
      });

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Embedding Error:', error.response?.data || error.message);
      throw new Error('Failed to generate embedding');
    }
  }
}

export const aiService = new AIService(); 