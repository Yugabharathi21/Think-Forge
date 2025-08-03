
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Box, useTheme } from '@mui/material';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

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
  const theme = useTheme();
  const { mode } = useAppTheme();
  
  // Determine background color based on state
  let bgColor = mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)';
  if (feedbackShown && isSelected && isCorrect) {
    bgColor = theme.palette.success.main + '20'; // 20% opacity green
  } else if (feedbackShown && isSelected && isCorrect === false) {
    bgColor = theme.palette.error.main + '20'; // 20% opacity red
  }
  
  return (
    <Button
      fullWidth
      onClick={onSelect}
      disabled={disabled}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'left',
        p: 1.5,
        borderRadius: 2,
        bgcolor: bgColor,
        color: 'text.primary',
        textTransform: 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        opacity: disabled ? 0.7 : 1,
        boxShadow: isSelected ? `0 0 8px ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          bgcolor: mode === 'dark' ? 'rgba(40,40,40,0.7)' : 'rgba(245,245,245,0.9)',
          borderColor: 'primary.main',
          boxShadow: `0 0 5px ${theme.palette.primary.main}`
        }
      }}
    >
      <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 'normal' }}>
        {option}
      </Box>
      
      {feedbackShown && isSelected && (
        <Box component="span">
          {isCorrect ? (
            <CheckIcon sx={{ color: 'success.main', fontSize: '1.25rem' }} />
          ) : (
            <CloseIcon sx={{ color: 'error.main', fontSize: '1.25rem' }} />
          )}
        </Box>
      )}
    </Button>
  );
};

export default MCQOption;
