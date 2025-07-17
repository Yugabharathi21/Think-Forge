
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb } from 'lucide-react';

export type MessageType = 'user' | 'ai' | 'system';

interface ChatMessageProps {
  type: MessageType;
  content: string | ReactNode;
  timestamp?: Date;
  metadata?: {
    type?: string;
    url?: string;
    topic?: string;
    planType?: string;
  };
}

const ChatMessage = ({ type, content, timestamp = new Date(), metadata }: ChatMessageProps) => {
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
          
          {/* Flowchart button if metadata indicates it's a flowchart link */}
          {metadata?.type === 'flowchart_link' && metadata.url && (
            <div className="mt-3">
              <Link to={metadata.url}>
                <Button 
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  {metadata.planType?.includes('mind map') ? (
                    <Lightbulb className="h-4 w-4" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  Generate {metadata.planType}
                </Button>
              </Link>
            </div>
          )}
          
          <div className="text-xs text-foreground/50 mt-1 text-right">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
