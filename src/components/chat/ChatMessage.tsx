
import { ReactNode } from 'react';

export type MessageType = 'user' | 'ai' | 'system';

interface ChatMessageProps {
  type: MessageType;
  content: string | ReactNode;
  timestamp?: Date;
}

const ChatMessage = ({ type, content, timestamp = new Date() }: ChatMessageProps) => {
  return (
    <div 
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {type === 'system' ? (
        <div className="w-full text-center">
          <div className="inline-block py-2 px-4 bg-foreground/10 rounded-lg text-sm text-foreground/70">
            {content}
          </div>
        </div>
      ) : (
        <div 
          className={`max-w-[80%] md:max-w-[70%] ${
            type === 'user' 
              ? 'bg-thinkforge-purple/30 rounded-tl-xl rounded-bl-xl rounded-br-xl' 
              : 'glass-card neon-border-light rounded-tr-xl rounded-br-xl rounded-bl-xl'
          } px-4 py-3`}
        >
          <div className="text-sm">{content}</div>
          <div className="text-xs text-foreground/50 mt-1 text-right">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
