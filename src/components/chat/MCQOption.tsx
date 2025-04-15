
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface MCQOptionProps {
  option: string;
  isCorrect?: boolean;
  isSelected: boolean;
  feedbackShown: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const MCQOption = ({ 
  option, 
  isCorrect, 
  isSelected, 
  feedbackShown, 
  onSelect, 
  disabled = false 
}: MCQOptionProps) => {
  return (
    <button
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between
        ${isSelected 
          ? 'glass-card neon-border-light' 
          : 'glass-card hover:neon-border-light'
        }
        ${feedbackShown && isSelected && isCorrect ? 'bg-green-500/20' : ''}
        ${feedbackShown && isSelected && isCorrect === false ? 'bg-red-500/20' : ''}
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onSelect}
      disabled={disabled}
    >
      <span className="text-sm">{option}</span>
      
      {feedbackShown && isSelected && (
        <span>
          {isCorrect ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )}
        </span>
      )}
    </button>
  );
};

export default MCQOption;
