import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Plus, Menu, Send, User, Bot, Trash2, Settings as SettingsIcon, Sun, Moon, Monitor, Volume2, VolumeX, Bell, BellOff, Languages, Thermometer } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned?: boolean;
}

interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  messageSound: boolean;
  notifications: boolean;
  language: string;
  enterToSend: boolean;
  autoScroll: boolean;
  timestampFormat: '12h' | '24h';
  codeBlockTheme: 'dark' | 'light';
  messageAlignment: 'left' | 'right';
}

export const TerminalChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    fontSize: 'medium',
    messageSound: true,
    notifications: true,
    language: 'en',
    enterToSend: true,
    autoScroll: true,
    timestampFormat: '24h',
    codeBlockTheme: 'dark',
    messageAlignment: 'left'
  });
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Getting Started with AI',
      lastMessage: 'How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load settings from backend
    fetchSettings();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      if (data.status === 'success' && data.data.settings) {
        setSettings(data.data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Use default settings if fetch fails
      setSettings({
        theme: 'dark',
        fontSize: 'medium',
        messageSound: true,
        notifications: true,
        language: 'en',
        enterToSend: true,
        autoScroll: true,
        timestampFormat: '24h',
        codeBlockTheme: 'dark',
        messageAlignment: 'left'
      });
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      const data = await response.json();
      if (data.status === 'success') {
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error: Failed to update settings. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;
    
    try {
      const response = await fetch(`/api/conversations/${chatToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      setChatHistory(prev => prev.filter(chat => chat.id !== chatToDelete));
      if (selectedChat === chatToDelete) {
        const remainingChats = chatHistory.filter(chat => chat.id !== chatToDelete);
        if (remainingChats.length > 0) {
          setSelectedChat(remainingChats[0].id);
        } else {
          const newChat = await createNewChat();
          setSelectedChat(newChat.id);
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error: Failed to delete chat. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setShowDeleteConfirm(false);
      setChatToDelete(null);
    }
  };

  const handleEditTitle = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/conversations/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to update chat title');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        ));
      }
    } catch (error) {
      console.error('Failed to update chat title:', error);
    } finally {
      setIsEditingTitle(false);
      setEditTitle('');
    }
  };

  const togglePinChat = (chatId: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: 'New Chat',
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (response.status !== 201) {
        throw new Error(data.message || 'Failed to create new chat');
      }

      console.log('New chat response:', data); // Debug log

      const newChat: ChatHistory = {
        id: data._id,
        title: data.title || 'New Chat',
        lastMessage: '',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [newChat, ...prev]);
      setMessages([]);
      setSelectedChat(newChat.id);
      return newChat;
    } catch (error: any) {
      console.error('Failed to create chat:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Error: ${error.message || 'Failed to create new chat. Please try again.'}`,
        timestamp: new Date()
      }]);
      throw error;
    }
  };

  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const newChat = await createNewChat();
      setSelectedChat(newChat.id);
      setMessages([]);
      // Clear input field
      setInput('');
    } catch (error) {
      console.error('Failed to create new chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await fetch(`/api/messages/${selectedChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: input })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.status === 'success' && data.data.aiMessage) {
        const { aiMessage } = data.data;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiMessage.content,
          timestamp: new Date(aiMessage.timestamp)
        }]);

        // Update chat history
        setChatHistory(prev => prev.map(chat => 
          chat.id === selectedChat
            ? { ...chat, lastMessage: aiMessage.content }
            : chat
        ));

        // Play sound if enabled
        if (settings.messageSound) {
          const audio = new Audio('/message.mp3');
          audio.play().catch(console.error);
        }

        // Show notification if enabled and window is not focused
        if (settings.notifications && !document.hasFocus()) {
          try {
            new Notification('New message from ThinkForge AI', {
              body: aiMessage.content.substring(0, 100) + (aiMessage.content.length > 100 ? '...' : ''),
              icon: '/logo.png'
            });
          } catch (error) {
            console.error('Failed to show notification:', error);
          }
        }
      }
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

  const renderSettingsPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#0a0a0a] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#1a1a1a]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-300">Settings</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' },
                { value: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' },
                { value: 'system', icon: <Monitor className="w-5 h-5" />, label: 'System' }
              ].map(theme => (
                <button
                  key={theme.value}
                  onClick={() => updateSettings({ theme: theme.value as 'light' | 'dark' | 'system' })}
                  className={`flex flex-col items-center p-3 rounded-lg space-y-2 ${
                    settings.theme === theme.value ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                  } hover:bg-[#262626]`}
                >
                  {theme.icon}
                  <span className="text-sm text-gray-300">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size as 'small' | 'medium' | 'large' })}
                  className={`p-2 rounded-lg text-center ${
                    settings.fontSize === size ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                  } hover:bg-[#262626] text-gray-300`}
                >
                  <span className="capitalize">{size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Notifications */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSettings({ messageSound: !settings.messageSound })}
              className={`p-3 rounded-lg flex items-center justify-center space-x-2 ${
                settings.messageSound ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
              } hover:bg-[#262626]`}
            >
              {settings.messageSound ? (
                <Volume2 className="w-5 h-5 text-gray-300" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-300" />
              )}
              <span className="text-gray-300">Sound</span>
            </button>
            <button
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`p-3 rounded-lg flex items-center justify-center space-x-2 ${
                settings.notifications ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
              } hover:bg-[#262626]`}
            >
              {settings.notifications ? (
                <Bell className="w-5 h-5 text-gray-300" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-300" />
              )}
              <span className="text-gray-300">Notifications</span>
            </button>
          </div>

          {/* Message Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">Message Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Enter to send</span>
                <button
                  onClick={() => updateSettings({ enterToSend: !settings.enterToSend })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.enterToSend ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-gray-300 transition ${
                    settings.enterToSend ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Auto-scroll</span>
                <button
                  onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.autoScroll ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-gray-300 transition ${
                    settings.autoScroll ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Time Format</label>
              <div className="grid grid-cols-2 gap-2">
                {['12h', '24h'].map(format => (
                  <button
                    key={format}
                    onClick={() => updateSettings({ timestampFormat: format as '12h' | '24h' })}
                    className={`p-2 rounded-lg text-center ${
                      settings.timestampFormat === format ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    } hover:bg-[#262626] text-gray-300`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Code Block Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {['dark', 'light'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => updateSettings({ codeBlockTheme: theme as 'dark' | 'light' })}
                    className={`p-2 rounded-lg text-center ${
                      settings.codeBlockTheme === theme ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    } hover:bg-[#262626] text-gray-300`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-medium text-gray-300 mb-4">Delete Chat</h3>
        <p className="text-gray-400 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#000000] transition-all duration-300 overflow-hidden flex flex-col border-r border-[#1a1a1a]`}>
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg border border-[#333333] hover:bg-[#1a1a1a] transition-colors text-gray-300"
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Chats */}
          {chatHistory.filter(chat => chat.isPinned).length > 0 && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase">Pinned Chats</h3>
              {chatHistory
                .filter(chat => chat.isPinned)
                .map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={selectedChat === chat.id}
                    isEditing={isEditingTitle && selectedChat === chat.id}
                    editTitle={editTitle}
                    onEditTitle={setEditTitle}
                    onSaveTitle={handleEditTitle}
                    onSelect={setSelectedChat}
                    onPin={togglePinChat}
                    onDelete={handleDeleteChat}
                    isPinned={true}
                    setIsEditingTitle={setIsEditingTitle}
                  />
                ))}
            </div>
          )}

          {/* Other Chats */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase">Chats</h3>
            {chatHistory
              .filter(chat => !chat.isPinned)
              .map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isSelected={selectedChat === chat.id}
                  isEditing={isEditingTitle && selectedChat === chat.id}
                  editTitle={editTitle}
                  onEditTitle={setEditTitle}
                  onSaveTitle={handleEditTitle}
                  onSelect={setSelectedChat}
                  onPin={togglePinChat}
                  onDelete={handleDeleteChat}
                  isPinned={false}
                  setIsEditingTitle={setIsEditingTitle}
                />
              ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-sm text-gray-300">{user?.username || 'guest'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-lg text-gray-300 font-medium">ThinkForge AI</h1>
          <div className="w-9"></div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto py-6 space-y-6 px-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-300 mb-2">Welcome to ThinkForge AI</h2>
                <p className="text-gray-400 mb-8">Start a conversation by typing a message below.</p>
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setInput("What can you help me with?")}
                    className="p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 text-left"
                  >
                    What can you help me with?
                  </button>
                  <button
                    onClick={() => setInput("Tell me about your capabilities.")}
                    className="p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 text-left"
                  >
                    Tell me about your capabilities.
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 ${
                    message.role === 'user' ? 'bg-transparent' : 'bg-[#1a1a1a]'
                  } rounded-lg p-4`}
                >
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-[#4a4a4a] flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                    ) : message.role === 'assistant' ? (
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
                        <Bot className="w-5 h-5 text-gray-300" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">
                        {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'AI' : 'System'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {settings.timestampFormat === '12h'
                          ? message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                          : message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                    <div className={`prose prose-invert max-w-none ${
                      settings.fontSize === 'small' ? 'text-sm' :
                      settings.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                      <pre className="whitespace-pre-wrap break-words font-mono bg-transparent text-gray-300">
                        {message.content}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start space-x-4 bg-[#1a1a1a] rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (settings.enterToSend && e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message ThinkForge AI..."
                className="w-full bg-[#1a1a1a] rounded-xl border border-[#333333] px-4 py-3 pr-12 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#4a4a4a] resize-none min-h-[52px] max-h-32 font-mono"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-[#262626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {settings.enterToSend ? 'Press Enter to send, Shift+Enter for new line' : 'Press Ctrl+Enter to send'}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isSettingsOpen ? 'visible' : 'invisible'}`}>
        <div className="bg-[#0a0a0a] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#1a1a1a]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-300">Settings</h2>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' },
                  { value: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' },
                  { value: 'system', icon: <Monitor className="w-5 h-5" />, label: 'System' }
                ].map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updateSettings({ theme: theme.value as 'light' | 'dark' | 'system' })}
                    className={`flex flex-col items-center p-3 rounded-lg space-y-2 ${
                      settings.theme === theme.value ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    } hover:bg-[#262626]`}
                  >
                    {theme.icon}
                    <span className="text-sm text-gray-300">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Font Size</label>
              <div className="grid grid-cols-3 gap-2">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size as 'small' | 'medium' | 'large' })}
                    className={`p-2 rounded-lg text-center ${
                      settings.fontSize === size ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    } hover:bg-[#262626] text-gray-300`}
                  >
                    <span className="capitalize">{size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Notifications */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ messageSound: !settings.messageSound })}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 ${
                  settings.messageSound ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                } hover:bg-[#262626]`}
              >
                {settings.messageSound ? (
                  <Volume2 className="w-5 h-5 text-gray-300" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-300" />
                )}
                <span className="text-gray-300">Sound</span>
              </button>
              <button
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 ${
                  settings.notifications ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                } hover:bg-[#262626]`}
              >
                {settings.notifications ? (
                  <Bell className="w-5 h-5 text-gray-300" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-300" />
                )}
                <span className="text-gray-300">Notifications</span>
              </button>
            </div>

            {/* Message Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Message Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Enter to send</span>
                  <button
                    onClick={() => updateSettings({ enterToSend: !settings.enterToSend })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.enterToSend ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-gray-300 transition ${
                      settings.enterToSend ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Auto-scroll</span>
                  <button
                    onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      settings.autoScroll ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-gray-300 transition ${
                      settings.autoScroll ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Time Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {['12h', '24h'].map(format => (
                    <button
                      key={format}
                      onClick={() => updateSettings({ timestampFormat: format as '12h' | '24h' })}
                      className={`p-2 rounded-lg text-center ${
                        settings.timestampFormat === format ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                      } hover:bg-[#262626] text-gray-300`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Code Block Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {['dark', 'light'].map(theme => (
                    <button
                      key={theme}
                      onClick={() => updateSettings({ codeBlockTheme: theme as 'dark' | 'light' })}
                      className={`p-2 rounded-lg text-center ${
                        settings.codeBlockTheme === theme ? 'bg-[#333333]' : 'bg-[#1a1a1a]'
                      } hover:bg-[#262626] text-gray-300`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${showDeleteConfirm ? 'visible' : 'invisible'}`}>
        <div className="bg-[#0a0a0a] rounded-lg p-6 w-full max-w-sm border border-[#1a1a1a]">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Delete Chat</h3>
          <p className="text-gray-400 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 hover:bg-[#262626]"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatListItem: React.FC<{
  chat: ChatHistory;
  isSelected: boolean;
  isEditing: boolean;
  editTitle: string;
  onEditTitle: (title: string) => void;
  onSaveTitle: (chatId: string, title: string) => void;
  onSelect: (chatId: string) => void;
  onPin: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  isPinned: boolean;
  setIsEditingTitle: (isEditing: boolean) => void;
}> = ({
  chat,
  isSelected,
  isEditing,
  editTitle,
  onEditTitle,
  onSaveTitle,
  onSelect,
  onPin,
  onDelete,
  isPinned,
  setIsEditingTitle
}) => (
  <div
    className={`group relative ${
      isSelected ? 'bg-gray-800' : ''
    }`}
  >
    <button
      onClick={() => onSelect(chat.id)}
      className="w-full text-left p-3 hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-start space-x-3">
        <MessageSquare className="w-4 h-4 mt-1 text-gray-400" />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitle(e.target.value)}
              onBlur={() => {
                if (editTitle.trim()) {
                  onSaveTitle(chat.id, editTitle);
                }
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editTitle.trim()) {
                  onSaveTitle(chat.id, editTitle);
                } else if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                }
              }}
              className="w-full bg-gray-700 text-sm text-gray-300 rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <div 
              className="text-sm text-gray-300 truncate cursor-text"
              onDoubleClick={() => {
                setIsEditingTitle(true);
                onEditTitle(chat.title);
                onSelect(chat.id);
              }}
            >
              {chat.title}
            </div>
          )}
          <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
        </div>
      </div>
    </button>
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
      <button
        onClick={() => onPin(chat.id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
        title={isPinned ? "Unpin chat" : "Pin chat"}
      >
        {isPinned ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14M19 5v14M5 5h14M5 19h14" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-7 7 7V5z" />
          </svg>
        )}
      </button>
      <button
        onClick={() => onDelete(chat.id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/20"
        title="Delete chat"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
); 