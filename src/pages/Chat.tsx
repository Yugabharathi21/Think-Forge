
import { useState, useRef, useEffect } from 'react';
import { Brain, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  
  const processChatLearningMessage = async (message: string) => {
    try {
      console.log(`🤖 Processing message for ${selectedSubject}:`, message);
      
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

  return (
    <Layout hideFooter={true}>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <ChatHeader />

        {/* Tips */}
        <ChatTips />

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto mb-4 pr-1">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                type={message.type} 
                content={message.content} 
                timestamp={message.timestamp} 
              />
            ))}
            
            {isWaitingForAI && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Subject Selection Chips (only show if no subject selected) */}
        {!selectedSubject && !isWaitingForAI && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select a subject to begin learning:</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant="outline"
                  size="sm"
                  className="glass-card"
                  onClick={() => handleSendMessage(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* MCQ Quiz Link */}
        {selectedSubject && (
          <div className="mb-4 text-center">
            <Link to="/mcq-quiz">
              <Button variant="link" className="text-sm">
                <Brain className="mr-2 h-4 w-4" />
                Want to test your knowledge? Try our MCQ Quiz
              </Button>
            </Link>
          </div>
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
      </div>
    </Layout>
  );
};

export default Chat;
