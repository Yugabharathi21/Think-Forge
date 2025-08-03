
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
          elevation={type === 'user' ? 1 : 2}
          sx={{
            maxWidth: { xs: '80%', md: '70%' },
            bgcolor: type === 'user' 
              ? 'primary.main' 
              : mode === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(245,245,245,0.95)',
            color: type === 'user' ? 'primary.contrastText' : 'text.primary',
            borderRadius: type === 'user' 
              ? '10px 0px 10px 10px' 
              : '0px 10px 10px 10px',
            px: 2,
            py: 1.5,
            backdropFilter: 'blur(10px)',
            borderColor: type === 'user' ? 'transparent' : mode === 'dark' ? 'divider' : 'grey.300',
            borderWidth: 1,
            borderStyle: 'solid',
            opacity: 1,
            boxShadow: type === 'user' 
              ? theme.shadows[1] 
              : mode === 'dark' ? theme.shadows[2] : '0 1px 3px rgba(0,0,0,0.1)',
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
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                    border: `1px solid ${theme.palette.primary.dark}`,
                    boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
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
