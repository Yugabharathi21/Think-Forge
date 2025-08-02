
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Button, useTheme } from '@mui/material';
import BrainIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

export type MessageType = 'user' | 'ai' | 'system';

interface ChatMessageProps {
  type: MessageType;
  content: string | ReactNode;
  timestamp?: Date;
  metadata?: {
    type?: string;
    url?: string;
    topic?: string;
    planType?: string;
  };
}

const ChatMessage = ({ type, content, timestamp = new Date(), metadata }: ChatMessageProps) => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: type === 'user' ? 'flex-end' : 'flex-start',
        mb: 4
      }}
    >
      {type === 'system' ? (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box 
            sx={{ 
              display: 'inline-block',
              py: 2,
              px: 4,
              bgcolor: 'action.hover',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {content}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Paper 
          elevation={2}
          sx={{
            maxWidth: { xs: '80%', md: '70%' },
            bgcolor: type === 'user' 
              ? 'primary.main' 
              : mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
            color: type === 'user' ? 'primary.contrastText' : 'text.primary',
            borderRadius: type === 'user' 
              ? '10px 0px 10px 10px' 
              : '0px 10px 10px 10px',
            px: 2,
            py: 1.5,
            backdropFilter: 'blur(10px)',
            borderColor: type === 'user' ? 'transparent' : 'divider',
            borderWidth: type === 'user' ? 0 : 1,
            borderStyle: 'solid',
            opacity: type === 'user' ? 0.9 : 1,
          }}
        >
          <Typography variant="body2">{content}</Typography>
          
          {/* Flowchart button if metadata indicates it's a flowchart link */}
          {metadata?.type === 'flowchart_link' && metadata.url && (
            <Box sx={{ mt: 2 }}>
              <Link to={metadata.url} style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained"
                  size="small"
                  startIcon={
                    metadata.planType?.includes('mind map') ? 
                      <LightbulbIcon sx={{ fontSize: 16 }} /> :
                      <BrainIcon sx={{ fontSize: 16 }} />
                  }
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  Generate {metadata.planType}
                </Button>
              </Link>
            </Box>
          )}
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              mt: 1, 
              textAlign: 'right' 
            }}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ChatMessage;
