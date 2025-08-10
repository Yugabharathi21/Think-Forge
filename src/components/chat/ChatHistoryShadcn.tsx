import React, { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  History, 
  Plus, 
  MessageCircle, 
  Calendar,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/lib/database';
import type { ChatSession } from '@/lib/supabase';

interface ChatHistoryShadcnProps {
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  isMobile?: boolean;
}

const ChatHistoryShadcn: React.FC<ChatHistoryShadcnProps> = ({
  currentSessionId,
  onSessionSelect,
  onNewChat,
  isMobile = false
}) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSessions = await chatService.getUserSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error('❌ Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateTitle = (title: string, maxLength: number = 35) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Computer Science': 'bg-blue-500',
      'Mathematics': 'bg-green-500',
      'Physics': 'bg-orange-500',
      'Chemistry': 'bg-purple-500',
      'Biology': 'bg-emerald-500',
      'History': 'bg-amber-600',
      'Geography': 'bg-slate-500',
      'Literature': 'bg-pink-500',
      'Philosophy': 'bg-violet-500',
      'Psychology': 'bg-red-500'
    };
    return colors[subject] || 'bg-primary';
  };

  const HistoryContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Chat History</h2>
        </div>
        <Button
          onClick={() => {
            onNewChat();
            if (isMobile) setOpen(false);
          }}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading history...</div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-sm mb-2">No conversations yet</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Start a conversation to see it here
            </p>
            <Button 
              onClick={() => {
                onNewChat();
                if (isMobile) setOpen(false);
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  currentSessionId === session.id 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-accent/50"
                )}
                onClick={() => {
                  onSessionSelect(session.id);
                  if (isMobile) setOpen(false);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex flex-col gap-2">
                    {/* Title and Date */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight flex-1">
                        {truncateTitle(session.title)}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formatDate(session.updated_at)}
                      </div>
                    </div>
                    
                    {/* Subject Badge and Active Indicator */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs text-white border-0",
                          getSubjectColor(session.subject)
                        )}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        {session.subject}
                      </Badge>
                      
                      {currentSessionId === session.id && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <History className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <HistoryContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="w-[300px] h-full flex flex-col">
      <HistoryContent />
    </Card>
  );
};

export default ChatHistoryShadcn;
