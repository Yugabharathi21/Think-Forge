import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiMessage: Message = {
        role: 'assistant',
        content: `[AI Response to: ${input}]`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-window min-h-screen flex flex-col">
      <div className="terminal-titlebar">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div>Terminal Chat - {user?.username || 'Guest'}</div>
        <div>v1.0.0</div>
      </div>

      <div className="terminal-content flex-1 overflow-y-auto">
        <div className="mb-4 text-green-400">
          Welcome to Terminal Chat! Type 'help' for available commands.
        </div>

        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-green-400">
                {message.role === 'user' ? '>' : '$'}
              </span>
              <span className="text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className={`ml-6 ${message.role === 'assistant' ? 'text-yellow-400' : 'text-white'}`}>
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-green-400">$</span>
            <span className="text-yellow-400 terminal-cursor">▋</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/20 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-green-400">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="terminal-input flex-1"
            placeholder="Type your message..."
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}; 