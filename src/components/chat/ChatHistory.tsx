import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  History as HistoryIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/lib/database';
import type { ChatSession } from '@/lib/supabase';

interface ChatHistoryProps {
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  currentSessionId,
  onSessionSelect,
  onNewChat
}) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSessions = await chatService.getUserSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error('❌ Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Computer Science': '#2196F3',
      'Mathematics': '#4CAF50',
      'Physics': '#FF9800',
      'Chemistry': '#9C27B0',
      'Biology': '#8BC34A',
      'History': '#795548',
      'Geography': '#607D8B',
      'Literature': '#E91E63',
      'Philosophy': '#673AB7',
      'Psychology': '#FF5722'
    };
    return colors[subject] || theme.palette.primary.main;
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Loading chat history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Chat History
          </Typography>
        </Box>
        <Tooltip title="New Chat">
          <IconButton 
            onClick={onNewChat}
            size="small"
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Chat Sessions List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No chat history yet. Start a conversation to see it here!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sessions.map((session, index) => (
              <React.Fragment key={session.id}>
                <ListItem 
                  disablePadding 
                  sx={{ 
                    bgcolor: currentSessionId === session.id ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemButton
                    onClick={() => onSessionSelect(session.id)}
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 1 
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="medium"
                        sx={{ 
                          flexGrow: 1,
                          lineHeight: 1.2,
                          mr: 1
                        }}
                      >
                        {truncateTitle(session.title)}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ flexShrink: 0 }}
                      >
                        {formatDate(session.updated_at)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Chip
                        label={session.subject}
                        size="small"
                        sx={{
                          bgcolor: getSubjectColor(session.subject),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      
                      {currentSessionId === session.id && (
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} />
                      )}
                    </Box>
                  </ListItemButton>
                </ListItem>
                
                {index < sessions.length - 1 && (
                  <Divider sx={{ mx: 2 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatHistory;
