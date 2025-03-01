import React from 'react';
import { BrainCircuit, Sparkles, Zap, Shield } from 'lucide-react';

const examples = [
  "Explain quantum computing in simple terms",
  "Design a 7-day itinerary for a trip to Japan",
  "Write a short story about a robot discovering emotions"
];

const capabilities = [
  "Processes and analyzes complex information",
  "Generates creative content and ideas",
  "Provides detailed explanations on various topics"
];

const limitations = [
  "May occasionally generate incorrect information",
  "Limited knowledge of events after training cutoff",
  "Cannot access the internet or run external code"
];

interface EmptyStateProps {
  onExampleClick: (example: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onExampleClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white px-4 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
        <BrainCircuit size={32} className="text-white" />
      </div>
      
      <h1 className="text-4xl font-bold mb-3 gradient-text">ThinkForge</h1>
      <p className="text-gray-400 text-center max-w-md mb-10">Your advanced AI assistant for creative thinking, problem-solving, and knowledge exploration</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Try asking</h2>
          </div>
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleClick(example)}
              className="p-4 mb-3 rounded-lg glass-effect hover:bg-dark-lighter text-sm text-left transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-secondary" />
            <h2 className="text-lg font-semibold">Capabilities</h2>
          </div>
          {capabilities.map((capability, index) => (
            <div key={index} className="p-4 mb-3 rounded-lg glass-effect text-sm">
              {capability}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-accent" />
            <h2 className="text-lg font-semibold">Limitations</h2>
          </div>
          {limitations.map((limitation, index) => (
            <div key={index} className="p-4 mb-3 rounded-lg glass-effect text-sm">
              {limitation}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;