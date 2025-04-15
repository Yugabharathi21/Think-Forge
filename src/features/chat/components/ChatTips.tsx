
import { Lightbulb } from 'lucide-react';

const ChatTips = () => {
  return (
    <div className="glass-card p-3 mb-4 flex items-start space-x-3">
      <Lightbulb className="h-5 w-5 text-thinkforge-purple flex-shrink-0 mt-0.5" />
      <div className="text-xs text-foreground/80">
        <p className="font-medium mb-1">Tips for effective learning:</p>
        <p>Be detailed in your answers and ask for help if you're stuck. The AI will provide feedback to help you improve.</p>
      </div>
    </div>
  );
};

export default ChatTips;
