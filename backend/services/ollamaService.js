import fetch from 'node-fetch';

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'deepseek-coder:6.7b';

export class OllamaService {
  static async generateResponse(messages) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: messages,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Ollama service error:', error);
      throw error;
    }
  }

  static async checkModelStatus() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: MODEL_NAME
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to check Ollama model status:', error);
      return false;
    }
  }
}

export default OllamaService; 