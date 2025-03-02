import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Conversation services
export const conversationService = {
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },
  
  getConversation: async (id: string) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },
  
  createConversation: async (title: string) => {
    const response = await api.post('/conversations', { title });
    return response.data;
  },
  
  updateConversation: async (id: string, title: string) => {
    const response = await api.put(`/conversations/${id}`, { title });
    return response.data;
  },
  
  deleteConversation: async (id: string) => {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  }
};

// Message services
export const messageService = {
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },
  
  createMessage: async (conversationId: string, content: string, role: 'user' | 'assistant' | 'system') => {
    const response = await api.post(`/messages/${conversationId}`, { content, role });
    return response.data;
  },
  
  generateAIResponse: async (conversationId: string, userMessage: string) => {
    const response = await api.post(`/messages/${conversationId}/generate`, { userMessage });
    return response.data;
  }
};

export default api;