
import { useState, FormEvent, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput = ({ 
  onSendMessage, 
  placeholder = "Type your answer here...", 
  disabled = false 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();
  const { mode } = useAppTheme();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={2}
      sx={{ 
        p: 1.5, 
        borderRadius: 3,
        bgcolor: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(250,250,250,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: mode === 'dark' ? 'divider' : 'grey.300',
        boxShadow: mode === 'dark' ? theme.shadows[2] : '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          inputRef={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          multiline
          maxRows={4}
          fullWidth
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { 
              fontSize: '0.875rem',
              minHeight: '60px',
              bgcolor: 'transparent',
              '& .MuiInputBase-input': {
                p: 1,
              }
            }
          }}
        />
        <IconButton 
          type="submit" 
          color="primary" 
          disabled={!message.trim() || disabled}
          sx={{ 
            ml: 1, 
            flexShrink: 0,
            bgcolor: !message.trim() || disabled ? 'transparent' : `${theme.palette.primary.main}10`,
            '&:hover': {
              bgcolor: !message.trim() || disabled ? 'transparent' : `${theme.palette.primary.main}20`,
            }
          }}
        >
          <SendIcon sx={{ 
            fontSize: 18,
            color: !message.trim() || disabled 
              ? mode === 'dark' ? 'grey.500' : 'grey.400'
              : theme.palette.primary.main
          }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInput;
