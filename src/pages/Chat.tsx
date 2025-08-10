
import { useState, useRef, useEffect } from 'react';
import { Brain, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Layout from '@/components/layout/Layout';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/features/chat/components/ChatHeader';
import ChatTips from '@/features/chat/components/ChatTips';
import TypingIndicator from '@/features/chat/components/TypingIndicator';
import ChatHistoryShadcn from '@/components/chat/ChatHistoryShadcn';
import { subjects } from '@/features/chat/constants';
import { Message } from '@/features/chat/types';
import { generateChatResponse } from '@/lib/ollama';
import { chatService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

const Chat = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { mode } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi there! I\'m ThinkForge, your AI learning assistant. Ask me anything you\'d like to learn about - I can help with mathematics, physics, chemistry, biology, computer science, history, geography, literature, economics, and more!',
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

  // Load chat session messages when session changes
  useEffect(() => {
    if (sessionId) {
      loadSessionMessages(sessionId);
    }
  }, [sessionId]);

  const loadSessionMessages = async (sessionIdToLoad: string) => {
    try {
      const sessionMessages = await chatService.getSessionMessages(sessionIdToLoad);
      const formattedMessages: Message[] = sessionMessages.map(msg => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('❌ Failed to load session messages:', error);
    }
  };

  const handleSessionSelect = async (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    setIsWaitingForAI(false);
    
    // Load session data to determine subject
    try {
      const userSessions = await chatService.getUserSessions(user?.id || '');
      const selectedSession = userSessions.find(s => s.id === selectedSessionId);
      if (selectedSession) {
        setSelectedSubject(selectedSession.subject);
      }
    } catch (error) {
      console.error('❌ Failed to load session data:', error);
    }
  };

  const handleNewChat = () => {
    setSessionId(null);
    setSelectedSubject(null);
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Hi there! I\'m ThinkForge, your AI learning assistant. Ask me anything you\'d like to learn about - I can help with mathematics, physics, chemistry, biology, computer science, history, geography, literature, economics, and more!',
        timestamp: new Date()
      }
    ]);
    setIsWaitingForAI(false);
  };

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsWaitingForAI(true);
    
    // Auto-detect subject from message if none selected
    let currentSubject = selectedSubject;
    if (!currentSubject) {
      const detectedSubject = detectSubjectFromMessage(content);
      if (detectedSubject) {
        currentSubject = detectedSubject;
        setSelectedSubject(detectedSubject);
        console.log('🎯 Auto-detected subject:', detectedSubject);
      } else {
        // Default to Computer Science if no subject detected
        currentSubject = 'Computer Science';
        setSelectedSubject('Computer Science');
        console.log('🔧 No subject detected, defaulting to Computer Science');
      }
    }
    
    // Create chat session when we have a subject
    let currentSessionId = sessionId;
    if (!currentSessionId && user && currentSubject) {
      try {
        console.log('📝 Creating chat session for subject:', currentSubject);
        const session = await chatService.createSession(
          user.id, 
          currentSubject, 
          `Learning ${currentSubject}`
        );
        if (session) {
          currentSessionId = session.id;
          setSessionId(currentSessionId);
          console.log('✅ Chat session created:', currentSessionId);
        }
      } catch (error) {
        console.error('❌ Failed to create chat session:', error);
      }
    }
    
    // Save user message to database if session exists
    if (currentSessionId && user) {
      try {
        await chatService.addMessage(currentSessionId, content, 'user');
        console.log('✅ User message saved to database');
      } catch (error) {
        console.error('❌ Failed to save user message:', error);
      }
    }
    
    // Process the message with the current subject
    await processChatLearningMessage(content, currentSubject);
  };
  
  // Helper function to detect subject from user message
  const detectSubjectFromMessage = (message: string): string | null => {
    const lcMessage = message.toLowerCase();
    
    // Define keywords for each subject
    const subjectKeywords = {
      'Mathematics': [
        'math', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry', 
        'statistics', 'probability', 'derivative', 'integral', 'equation', 
        'function', 'graph', 'matrix', 'vector', 'polynomial', 'logarithm',
        'factorial', 'theorem', 'proof', 'solve', 'calculate', 'formula'
      ],
      'Physics': [
        'physics', 'force', 'energy', 'motion', 'velocity', 'acceleration', 
        'momentum', 'gravity', 'wave', 'light', 'electricity', 'magnetism',
        'quantum', 'relativity', 'thermodynamics', 'mechanics', 'optics',
        'newton', 'einstein', 'particle', 'atom', 'nuclear'
      ],
      'Chemistry': [
        'chemistry', 'chemical', 'element', 'compound', 'molecule', 'atom',
        'reaction', 'bond', 'periodic table', 'solution', 'acid', 'base',
        'organic', 'inorganic', 'catalyst', 'oxidation', 'reduction',
        'ph', 'molarity', 'electron', 'ion', 'isotope'
      ],
      'Biology': [
        'biology', 'biological', 'cell', 'organism', 'dna', 'rna', 'gene',
        'protein', 'enzyme', 'evolution', 'ecology', 'anatomy', 'physiology',
        'photosynthesis', 'respiration', 'mitosis', 'meiosis', 'ecosystem',
        'species', 'bacteria', 'virus', 'plant', 'animal'
      ],
      'Computer Science': [
        'computer science', 'programming', 'algorithm', 'data structure',
        'software', 'hardware', 'code', 'coding', 'python', 'java', 'javascript',
        'database', 'machine learning', 'ai', 'artificial intelligence',
        'network', 'cybersecurity', 'web development', 'app development',
        'binary', 'cpu', 'memory', 'operating system'
      ],
      'History': [
        'history', 'historical', 'ancient', 'medieval', 'modern', 'war',
        'revolution', 'empire', 'civilization', 'culture', 'timeline',
        'century', 'dynasty', 'kingdom', 'democracy', 'politics', 'government'
      ],
      'Geography': [
        'geography', 'geographical', 'continent', 'country', 'city', 'mountain',
        'river', 'ocean', 'climate', 'weather', 'population', 'capital',
        'map', 'latitude', 'longitude', 'ecosystem', 'natural resources'
      ],
      'Literature': [
        'literature', 'poem', 'poetry', 'novel', 'story', 'author', 'writer',
        'character', 'plot', 'theme', 'metaphor', 'symbolism', 'genre',
        'shakespeare', 'fiction', 'non-fiction', 'essay', 'drama'
      ],
      'Economics': [
        'economics', 'economy', 'market', 'supply', 'demand', 'price',
        'inflation', 'gdp', 'trade', 'business', 'finance', 'investment',
        'capitalism', 'socialism', 'recession', 'growth', 'unemployment'
      ]
    };
    
    let bestMatch = null;
    let maxMatches = 0;
    
    // Count keyword matches for each subject
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      const matches = keywords.filter(keyword => lcMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = subject;
      }
    }
    
    // Return the subject if we found at least one keyword match
    return maxMatches > 0 ? bestMatch : null;
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
  
  const processChatLearningMessage = async (message: string, currentSubject?: string) => {
    const subjectToUse = currentSubject || selectedSubject;
    
    if (!subjectToUse) {
      console.error('❌ No subject available for processing message');
      return;
    }
    
    try {
      console.log(`🤖 Processing message for ${subjectToUse}:`, message);
      
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
        const topic = subjectToUse || extractTopicFromMessage(message) || 'General Learning';
        
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
        
        // Save AI message to database
        if (sessionId && user) {
          try {
            await chatService.addMessage(sessionId, responseMessage, 'assistant');
            console.log('✅ Flowchart link message saved to database');
          } catch (error) {
            console.error('❌ Failed to save flowchart link message:', error);
          }
        }
        
        setIsWaitingForAI(false);
        return;
      }
      
      // Create chat session if it doesn't exist
      let currentSessionId = sessionId;
      if (!currentSessionId && user) {
        console.log('📝 Creating new chat session...');
        const session = await chatService.createSession(
          user.id, 
          subjectToUse, 
          `Chat about ${subjectToUse}`
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
        subjectToUse,
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
      
      // Save AI message to database
      if (currentSessionId && user) {
        try {
          await chatService.addMessage(currentSessionId, response, 'assistant');
          console.log('✅ AI response saved to database');
        } catch (error) {
          console.error('❌ Failed to save AI response:', error);
        }
      }
      
      setIsWaitingForAI(false);
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I'm having trouble processing your question about ${subjectToUse}. Could you try rephrasing it or ask about a specific concept?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      // Save fallback message to database
      if (sessionId && user) {
        try {
          await chatService.addMessage(sessionId, fallbackMessage.content, 'assistant');
          console.log('✅ Fallback message saved to database');
        } catch (error) {
          console.error('❌ Failed to save fallback message:', error);
        }
      }
      
      setIsWaitingForAI(false);
    }
  };

  return (
    <Layout hideFooter={true}>
      <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 120px)',
        gap: 0
      }}>
        {/* Chat History Sidebar - Desktop */}
        {!isMobile && (
          <Box sx={{ width: 300, flexShrink: 0 }}>
            <ChatHistoryShadcn
              currentSessionId={sessionId}
              onSessionSelect={handleSessionSelect}
              onNewChat={handleNewChat}
              isMobile={false}
            />
          </Box>
        )}

        {/* Main Chat Area */}
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          pl: isMobile ? 0 : 2
        }}>
          {/* Header with History Toggle */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            px: isMobile ? 1 : 0
          }}>
            {isMobile && (
              <ChatHistoryShadcn
                currentSessionId={sessionId}
                onSessionSelect={handleSessionSelect}
                onNewChat={handleNewChat}
                isMobile={true}
              />
            )}
            <Box sx={{ flexGrow: 1 }}>
              <ChatHeader />
            </Box>
          </Box>

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
      </Box>
    </Layout>
  );
};

export default Chat;
