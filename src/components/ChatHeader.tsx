import React from 'react';
import { Menu, Sparkles, BrainCircuit } from 'lucide-react';

interface ChatHeaderProps {
  toggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleSidebar }) => {
  return (
    <div className="border-b border-white/10 bg-dark-lighter py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="md:hidden rounded-md p-2 text-gray-400 hover:bg-dark-darker hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        
        <div className="flex items-center space-x-2">
          <BrainCircuit size={24} className="text-primary" />
          <h1 className="text-xl font-bold text-white">
            Think<span className="text-primary">Forge</span>
          </h1>
        </div>
        
        <button className="flex items-center space-x-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20 transition-colors">
          <Sparkles size={14} />
          <span>Pro</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;