
import { Link } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Brain className="h-6 w-6 text-thinkforge-purple mr-2" />
        <h1 className="text-xl font-bold">ThinkForge AI Chat</h1>
      </div>
      <Link to="/progress">
        <Button variant="outline" size="sm" className="text-xs border-thinkforge-purple/50">
          View Progress
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
};

export default ChatHeader;
