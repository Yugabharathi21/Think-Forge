import { useState, useEffect } from 'react';
import { Box, Button, Card, Paper, Typography, useTheme } from '@mui/material';
import MCQOption from './MCQOption';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

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
  const theme = useTheme();
  const { mode } = useAppTheme();
  
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
    <Box sx={{ width: '100%', mb: 2 }}>
      <Card 
        elevation={2} 
        sx={{ 
          borderRadius: 4,
          p: 2,
          backdropFilter: 'blur(10px)',
          bgcolor: mode === 'dark' ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.9)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}
        >
          {data.question}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
        </Box>
        
        {showFeedback && data.explanation && (
          <Paper 
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              bgcolor: mode === 'dark' ? 'rgba(50,50,50,0.5)' : 'rgba(240,240,240,0.7)',
              borderRadius: 2
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {data.explanation}
            </Typography>
          </Paper>
        )}
        
        {!showFeedback && !isAnswerSubmitted && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              sx={{ px: 3 }}
            >
              Submit Answer
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MCQQuestion;
