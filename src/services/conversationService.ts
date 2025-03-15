import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  metadata: {
    model: string;
    totalTokens: number;
    lastActivity: Date;
  };
}

export interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

class ConversationService {
  async createConversation() {
    const response = await axios.post(`${API_URL}/conversations`);
    return response.data;
  }

  async getConversations() {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data;
  }

  async getConversation(id: string) {
    const response = await axios.get(`${API_URL}/conversations/${id}`);
    return response.data;
  }

  async sendMessage(conversationId: string, content: string) {
    const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
      content,
      role: 'user'
    });
    return response.data;
  }
}

export default new ConversationService();