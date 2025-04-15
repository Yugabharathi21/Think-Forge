import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MCQOption from './MCQOption';

export interface MCQQuestionData {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

interface MCQQuestionProps {
  data: MCQQuestionData;
  onAnswer: (wasCorrect: boolean, selectedOptionIndex: number) => void;
  isAnswerSubmitted: boolean;
}

const MCQQuestion = ({ data, onAnswer, isAnswerSubmitted }: MCQQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, [data.id]);
  
  const handleOptionSelect = (index: number) => {
    if (showFeedback || isAnswerSubmitted) return; // Prevent changing answer after submission
    setSelectedOption(index);
  };
  
  const handleSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    
    const isCorrect = selectedOption === data.correctOption;
    setShowFeedback(true);
    onAnswer(isCorrect, selectedOption);
  };
  
  return (
    <div className="space-y-4 w-full">
      <div className="glass-card p-4 rounded-xl">
        <h3 className="mb-3 font-medium">{data.question}</h3>
        
        <div className="space-y-2">
          {data.options.map((option, index) => (
            <MCQOption
              key={index}
              option={option}
              isSelected={selectedOption === index}
              isCorrect={showFeedback ? index === data.correctOption : undefined}
              feedbackShown={showFeedback}
              onSelect={() => handleOptionSelect(index)}
              disabled={showFeedback || isAnswerSubmitted}
            />
          ))}
        </div>
        
        {showFeedback && data.explanation && (
          <div className="mt-4 p-3 bg-foreground/10 rounded-lg">
            <p className="text-sm text-foreground/80">{data.explanation}</p>
          </div>
        )}
        
        {!showFeedback && !isAnswerSubmitted && (
          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
              onClick={handleSubmit}
              disabled={selectedOption === null}
            >
              Submit Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQQuestion;
