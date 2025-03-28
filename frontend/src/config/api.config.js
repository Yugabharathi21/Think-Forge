const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Conversation endpoints
  CONVERSATIONS: `${API_BASE_URL}/conversations`,
  CONVERSATION: (id) => `${API_BASE_URL}/conversations/${id}`,
  MESSAGES: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}/messages`,
  ARCHIVE_CONVERSATION: (id) => `${API_BASE_URL}/conversations/${id}/archive`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export default API_ENDPOINTS; 