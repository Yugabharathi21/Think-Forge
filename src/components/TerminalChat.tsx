import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Plus, Menu, Send, User, Bot, Trash2, Edit3 } from 'lucide-react';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const TerminalChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Getting Started with AI',
      lastMessage: 'How can I help you today?',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Project Planning',
      lastMessage: 'Let\'s discuss your project requirements',
      timestamp: new Date()
    }
  ]);
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Add system welcome message
    setMessages([
      {
        role: 'system',
        content: `Welcome to ThinkForge AI\nI'm your AI assistant. How can I help you today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiMessage: Message = {
        role: 'assistant',
        content: `I understand you said: "${input}"\n\nThis is a simulated AI response that demonstrates how the chat interface works. In a real implementation, this would be connected to your AI backend.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error: Failed to process your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: 'Start a new conversation',
      timestamp: new Date()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setSelectedChat(newChat.id);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-950 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-gray-300"
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full text-left p-3 hover:bg-gray-800 transition-colors ${
                selectedChat === chat.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-4 h-4 mt-1 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-300 truncate">{chat.title}</div>
                  <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-sm text-gray-300">{user?.username || 'guest'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-lg text-gray-300 font-medium">ThinkForge AI</h1>
          <div className="w-9"></div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-6 px-4 ${
                  message.role === 'user' ? 'bg-transparent' : 'bg-gray-800/50'
                } py-6`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  {message.role === 'user' ? (
                    <div className="bg-gray-700 rounded-full p-1">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                  ) : (
                    <div className="bg-green-600 rounded-full p-1">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-gray-300 prose prose-invert">
                    <pre className="whitespace-pre-wrap break-words text-sm font-sans">
                      {message.content}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-6 px-4 bg-gray-800/50 py-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-gray-900">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ThinkForge AI..."
                className="w-full bg-gray-800 rounded-xl border border-gray-700 px-4 py-3 pr-12 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none min-h-[52px] max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center">
              ThinkForge AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 