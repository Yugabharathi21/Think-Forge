import React, { createContext, useContext, useState, useCallback } from 'react';
import conversationService, { Conversation, Message } from '../services/conversationService';

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  startNewConversation: () => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      setLoading(true);
      const conversation = await conversationService.createConversation();
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      return conversation._id;
    } catch (err) {
      setError('Failed to create new conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversation) return;
    try {
      setLoading(true);
      const response = await conversationService.sendMessage(currentConversation._id, content);
      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, ...response.messages]
        };
      });
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  const value = {
    conversations,
    currentConversation,
    loading,
    error,
    loadConversations,
    startNewConversation,
    sendMessage
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};