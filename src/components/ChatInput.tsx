import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-white/10 bg-dark-darker py-4 chat-input-shadow">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <div className="rounded-xl border border-white/10 bg-dark-lighter p-1 shadow-inner-lg">
            <div className="flex items-end">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ThinkForge..."
                className="w-full resize-none rounded-lg bg-transparent p-3 pr-16 text-white placeholder-gray-400 focus:outline-none max-h-[200px] min-h-[56px]"
                rows={1}
                disabled={isLoading}
              />
              <div className="flex items-center space-x-2 pr-3 pb-3">
                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-dark-darker hover:text-gray-300 transition-colors"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-dark-darker hover:text-gray-300 transition-colors"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className={`rounded-full p-2 transition-colors ${
                    message.trim() && !isLoading
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-dark-darker text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            className="absolute -top-10 right-0 flex items-center space-x-1 rounded-full bg-dark-lighter px-3 py-1.5 text-xs text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            <Sparkles size={14} />
            <span>Suggest prompts</span>
          </button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-3">
          ThinkForge may produce inaccurate information about people, places, or facts.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;