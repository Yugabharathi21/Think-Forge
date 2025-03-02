import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import EmptyState from '../components/EmptyState';
import { conversationService, messageService } from '../services/api';
import { Conversation, Message } from '../types';

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom whenever messages change or when loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversationService.getConversations();
        setConversations(response.data);
        
        // If there's a conversationId in the URL, set it as active
        if (conversationId) {
          const conversation = response.data.find((conv: Conversation) => conv.id === conversationId);
          if (conversation) {
            fetchConversation(conversationId);
          }
        } else if (response.data.length > 0) {
          // Otherwise, set the first conversation as active
          fetchConversation(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsFetching(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user, conversationId]);

  // Fetch a single conversation with its messages
  const fetchConversation = async (id: string) => {
    try {
      const response = await conversationService.getConversation(id);
      setActiveConversation(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // If no active conversation, create a new one
    if (!activeConversation) {
      try {
        const title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        const response = await conversationService.createConversation(title);
        const newConversation = response.data;
        
        setConversations([newConversation, ...conversations]);
        setActiveConversation(newConversation);
        
        // Now send the message to this new conversation
        await generateAIResponse(newConversation.id, content);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    } else {
      // Send message to existing conversation
      await generateAIResponse(activeConversation.id, content);
    }
  };

  const generateAIResponse = async (conversationId: string, content: string) => {
    setIsLoading(true);
    
    try {
      const response = await messageService.generateAIResponse(conversationId, content);
      
      // Update the active conversation with the new messages
      await fetchConversation(conversationId);
      
      // Also update the conversations list to show the latest message
      const updatedConversations = await conversationService.getConversations();
      setConversations(updatedConversations.data);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await conversationService.createConversation('New Conversation');
      const newConversation = response.data;
      
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    await fetchConversation(conversation.id);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      setConversations(updatedConversations);
      
      // If the active conversation was deleted, set active to null or the first conversation
      if (activeConversation?.id === conversationId) {
        setActiveConversation(updatedConversations.length > 0 ? updatedConversations[0] : null);
        if (updatedConversations.length > 0) {
          await fetchConversation(updatedConversations[0].id);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleExampleClick = (example: string) => {
    handleSendMessage(example);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-dark-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-darker text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block flex-shrink-0 h-full`}>
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-dark-darker">
        <ChatHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-y-auto">
          {activeConversation && activeConversation.messages && activeConversation.messages.length > 0 ? (
            <>
              {activeConversation.messages.map((message: Message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <EmptyState onExampleClick={handleExampleClick} />
          )}
          
          {isLoading && (
            <div className="py-6 bg-dark-lighter">
              <div className="max-w-4xl mx-auto flex gap-4 px-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30">
                    <div className="h-3 w-3 rounded-full bg-secondary pulse-animation"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-dark-darker rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-2/3 bg-dark-darker rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-1/2 bg-dark-darker rounded animate-pulse"></div>
                </div>
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Chat;