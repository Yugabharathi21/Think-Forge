
import { useState, useRef, useEffect } from 'react';
import { Brain, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, useTheme } from '@mui/material';
import Layout from '@/components/layout/Layout';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/features/chat/components/ChatHeader';
import ChatTips from '@/features/chat/components/ChatTips';
import TypingIndicator from '@/features/chat/components/TypingIndicator';
import { subjects } from '@/features/chat/constants';
import { Message } from '@/features/chat/types';
import { generateChatResponse } from '@/lib/ollama';
import { chatService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi there! I\'m ThinkForge, your AI learning assistant. What subject would you like to learn about today?',
      timestamp: new Date()
    }
  ]);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsWaitingForAI(true);
    
    // If no subject selected yet, process the subject selection
    if (!selectedSubject) {
      processSubjectSelection(content);
    } else {
      await processChatLearningMessage(content);
    }
  };
  
  const processSubjectSelection = async (content: string) => {
    const subjectMatch = subjects.find(
      subject => content.toLowerCase().includes(subject.toLowerCase())
    );
    
    setTimeout(async () => {
      if (subjectMatch) {
        console.log('📚 Subject selected:', subjectMatch);
        setSelectedSubject(subjectMatch);
        
        // Create chat session when subject is selected
        if (user && !sessionId) {
          try {
            console.log('📝 Creating chat session for subject:', subjectMatch);
            const session = await chatService.createSession(
              user.id, 
              subjectMatch, 
              `Learning ${subjectMatch}`
            );
            if (session) {
              setSessionId(session.id);
              console.log('✅ Chat session created:', session.id);
            }
          } catch (error) {
            console.error('❌ Failed to create chat session:', error);
          }
        }
        
        const newAIMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `Great! I'll help you learn ${subjectMatch}. What specific topic would you like to explore? You can ask me to explain concepts, solve problems, or provide examples.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAIMessage]);
      } else {
        const newAIMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `I'm not sure which subject you want to learn about. Can you please select one of the following: ${subjects.join(', ')}?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAIMessage]);
      }
      setIsWaitingForAI(false);
    }, 1500);
  };
  
  // Helper function to extract topic from user message
  const extractTopicFromMessage = (message: string): string | null => {
    // Simple extraction - look for phrases like "create a flowchart for X" or "study plan for Y"
    const patterns = [
      /(?:flowchart|study plan|mind map|roadmap)\s+(?:for|about|on)\s+([^.!?]+)/i,
      /(?:learn|study)\s+([^.!?]+?)(?:\s+(?:flowchart|study plan|mind map))/i,
      /(?:help me with|teach me)\s+([^.!?]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  };
  
  const processChatLearningMessage = async (message: string) => {
    try {
      console.log(`🤖 Processing message for ${selectedSubject}:`, message);
      
      // Check if user is requesting a flowchart or study plan
      const flowchartKeywords = ['flowchart', 'flow chart', 'study plan', 'learning plan', 'mind map', 'mindmap', 'roadmap', 'study roadmap'];
      const isFlowchartRequest = flowchartKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      if (isFlowchartRequest) {
        console.log('🎯 Flowchart/Study plan request detected');
        
        // Determine the type based on keywords
        const isMindMap = message.toLowerCase().includes('mind map') || message.toLowerCase().includes('mindmap');
        const type = isMindMap ? 'mind-map' : 'study-plan';
        
        // Extract topic (use selected subject or try to extract from message)
        const topic = selectedSubject || extractTopicFromMessage(message) || 'General Learning';
        
        // Create a response with a link to the study plan page
        const planType = isMindMap ? 'mind map' : 'study plan';
        const studyPlanUrl = `/study-plan?topic=${encodeURIComponent(topic)}&type=${type}`;
        
        const responseMessage = `I'll create a ${planType} for ${topic}! Click the button below to view your AI-generated ${planType}.`;
        
        const newAIMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: responseMessage,
          timestamp: new Date(),
          metadata: {
            type: 'flowchart_link',
            url: studyPlanUrl,
            topic: topic,
            planType: planType
          }
        };

        setMessages(prev => [...prev, newAIMessage]);
        setIsWaitingForAI(false);
        return;
      }
      
      // Create chat session if it doesn't exist
      let currentSessionId = sessionId;
      if (!currentSessionId && user) {
        console.log('📝 Creating new chat session...');
        const session = await chatService.createSession(
          user.id, 
          selectedSubject || 'General', 
          `Chat about ${selectedSubject || 'General'}`
        );
        if (session) {
          currentSessionId = session.id;
          setSessionId(currentSessionId);
          console.log('✅ Chat session created:', currentSessionId);
        }
      }

      // Generate AI response using Ollama
      console.log('🎯 Generating AI response...');
      const response = await generateChatResponse(
        currentSessionId,
        message,
        selectedSubject || 'Computer Science',
        messages.slice(-5).map(m => `${m.type}: ${m.content}`) // Last 5 messages for context
      );

      console.log('✅ AI response received:', response.substring(0, 100) + '...');

      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsWaitingForAI(false);
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I'm having trouble processing your question about ${selectedSubject}. Could you try rephrasing it or ask about a specific concept?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsWaitingForAI(false);
    }
  };

  const theme = useTheme();
  const { mode } = useAppTheme();

  return (
    <Layout hideFooter={true}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 120px)'
      }}>
        {/* Header */}
        <ChatHeader />

        {/* Tips */}
        <ChatTips />

        {/* Chat Messages */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          mb: 4,
          pr: 1
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                type={message.type} 
                content={message.content} 
                timestamp={message.timestamp}
                metadata={message.metadata}
              />
            ))}
            
            {isWaitingForAI && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Subject Selection Chips (only show if no subject selected) */}
        {!selectedSubject && !isWaitingForAI && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
              Select a subject to begin learning:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 1
            }}>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSendMessage(subject)}
                  sx={{
                    textTransform: 'none',
                    borderColor: theme.palette.mode === 'dark' ? 'divider' : theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.main,
                    backdropFilter: 'blur(10px)',
                    bgcolor: mode === 'dark' ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.9)',
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  {subject}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* MCQ Quiz Link */}
        {selectedSubject && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Link to="/mcq-quiz" style={{ textDecoration: 'none' }}>
              <Button
                variant="text"
                color="primary"
                startIcon={<Brain style={{ fontSize: 18 }} />}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.primary.dark,
                    textDecoration: 'underline'
                  }
                }}
              >
                Want to test your knowledge? Try our MCQ Quiz
              </Button>
            </Link>
          </Box>
        )}

        {/* Chat Input */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isWaitingForAI}
          placeholder={
            isWaitingForAI 
              ? "AI is typing..." 
              : "Type your message here..."
          }
        />
      </Box>
    </Layout>
  );
};

export default Chat;
