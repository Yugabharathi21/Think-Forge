
import { useState, useEffect } from 'react';
import { subjects } from '../constants';
import { Message } from '../types';
import { toast } from "sonner";
import { generateChatResponse } from '@/lib/ollama';
import { chatService, authService } from '@/lib/database';
import { User } from '@supabase/supabase-js';

export const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi there! I\'m ThinkForge, your AI learning assistant. What subject would you like to learn about today?',
      timestamp: new Date()
    }
  ]);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for current user
    authService.getCurrentUser().then(({ user }) => {
      setCurrentUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      const sessionData = session as { user?: User } | null;
      setCurrentUser(sessionData?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createNewSession = async (subject: string) => {
    if (!currentUser) return null;
    
    const title = `${subject} Learning Session - ${new Date().toLocaleDateString()}`;
    const session = await chatService.createSession(currentUser.id, subject, title);
    setCurrentSessionId(session?.id || null);
    return session;
  };

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsWaitingForAI(true);
    
    try {
      // If no subject selected yet, process the subject selection
      if (!selectedSubject) {
        await processSubjectSelection(content);
      } else {
        await processChatLearningMessage(content);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsWaitingForAI(false);
    }
  };
  
  const processSubjectSelection = async (content: string) => {
    const subjectMatch = subjects.find(
      subject => content.toLowerCase().includes(subject.toLowerCase())
    );
    
    if (subjectMatch) {
      setSelectedSubject(subjectMatch);
      
      // Create new chat session if user is logged in
      if (currentUser) {
        await createNewSession(subjectMatch);
      }
      
      const responseContent = `Great! I'll help you learn ${subjectMatch}. What specific topic would you like to explore? You can ask me to explain concepts, solve problems, or provide examples.`;
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      toast(`Now learning: ${subjectMatch}`);
    } else {
      const responseContent = `I'm not sure which subject you want to learn about. Can you please select one of the following: ${subjects.join(', ')}?`;
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    }
  };
  
  const processChatLearningMessage = async (message: string) => {
    if (!selectedSubject) return;

    try {
      // Get recent conversation context
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const context = recentMessages.map(msg => `${msg.type}: ${msg.content}`);

      // Generate AI response using Ollama + Supabase integration
      const aiResponse = await generateChatResponse(
        currentSessionId,
        message,
        selectedSubject,
        context
      );
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      const fallbackResponse = `I apologize for the technical difficulty. Let me try to help you with ${selectedSubject} in a different way. Could you rephrase your question or ask about a specific concept?`;
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    }
  };

  const loadPreviousSession = async (sessionId: string) => {
    const sessionMessages = await chatService.getSessionMessages(sessionId);
    const convertedMessages: Message[] = sessionMessages.map(msg => ({
      id: msg.id,
      type: msg.role === 'user' ? 'user' : 'ai',
      content: msg.content,
      timestamp: new Date(msg.created_at)
    }));
    
    setMessages(convertedMessages);
    setCurrentSessionId(sessionId);
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Hi there! I\'m ThinkForge, your AI learning assistant. What subject would you like to learn about today?',
        timestamp: new Date()
      }
    ]);
    setSelectedSubject(null);
    setCurrentSessionId(null);
  };

  return {
    messages,
    isWaitingForAI,
    selectedSubject,
    currentSessionId,
    currentUser,
    handleSendMessage,
    loadPreviousSession,
    startNewConversation
  };
};
