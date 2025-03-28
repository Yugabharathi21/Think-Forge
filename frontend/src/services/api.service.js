import API_ENDPOINTS, { getAuthHeaders } from '../config/api.config';

class ApiService {
  static async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(data.error || 'Something went wrong');
    }
    return data;
  }

  // Conversation Methods
  static async getConversations() {
    try {
      const response = await fetch(API_ENDPOINTS.CONVERSATIONS, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  static async createConversation(title) {
    try {
      const response = await fetch(API_ENDPOINTS.CONVERSATIONS, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ title }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }

  static async getMessages(conversationId) {
    try {
      const response = await fetch(API_ENDPOINTS.MESSAGES(conversationId), {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  static async sendMessage(conversationId, content) {
    try {
      const response = await fetch(API_ENDPOINTS.SEND_MESSAGE(conversationId), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Auth Methods
  static async login(credentials) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      const data = await this.handleResponse(response);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export default ApiService; 