import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, LogOut, BrainCircuit, Sparkles, Zap, Layers } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full sidebar-gradient text-white w-72 p-3">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <BrainCircuit size={28} className="text-primary" />
        <h1 className="text-2xl font-bold">
          Think<span className="text-primary">Forge</span>
        </h1>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark p-3 text-sm font-medium transition-colors duration-200"
      >
        <Plus size={18} />
        <span>New conversation</span>
      </button>

      {/* Conversations List */}
      <div className="flex-1 mt-6 overflow-y-auto">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-3 mb-2">Recent conversations</h2>
        <div className="flex flex-col gap-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm cursor-pointer relative group ${
                activeConversation?.id === conversation.id 
                  ? 'bg-dark-lighter text-white' 
                  : 'text-gray-300 hover:bg-dark-lighter/50 hover:text-white'
              }`}
              onClick={() => onSelectConversation(conversation)}
              onMouseEnter={() => setHoveredConversation(conversation.id)}
              onMouseLeave={() => setHoveredConversation(null)}
            >
              <MessageSquare size={16} className={activeConversation?.id === conversation.id ? 'text-primary' : 'text-gray-400'} />
              <span className="truncate flex-1">{conversation.title}</span>
              {(hoveredConversation === conversation.id || activeConversation?.id === conversation.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-3 py-4 mb-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Features</h2>
        <div className="bg-dark-lighter rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-primary" />
            <span>Advanced reasoning</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className="text-secondary" />
            <span>Fast responses</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Layers size={16} className="text-accent" />
            <span>Knowledge integration</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 pt-3 mt-auto">
        <button className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-dark-lighter transition-colors">
          <Settings size={16} className="text-gray-400" />
          <span>Settings</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-dark-lighter transition-colors">
          <LogOut size={16} className="text-gray-400" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;