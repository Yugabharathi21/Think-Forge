import api from './api';

export interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  conversation: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  title: string;
  lastActivity: string;
  isArchived: boolean;
}

export interface StreamResponse {
  content?: string;
  done?: boolean;
  messageId?: string;
}

export const chatService = {
  // Conversation methods
  createConversation: async (title: string) => {
    const response = await api.post('/conversations', { title });
    return response.data.data;
  },

  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data.data;
  },

  archiveConversation: async (conversationId: string) => {
    const response = await api.patch(`/conversations/${conversationId}/archive`);
    return response.data.data;
  },

  // Message methods
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data.data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      content,
    });
    return response.data.data;
  },

  streamResponse: async (conversationId: string, content: string, onChunk: (chunk: string) => void, onComplete: (messageId: string) => void) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${api.defaults.baseURL}/messages/${conversationId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is null');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data: StreamResponse = JSON.parse(line.slice(6));
            if (data.done && data.messageId) {
              onComplete(data.messageId);
              return;
            } else if (data.content) {
              onChunk(data.content);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}; 