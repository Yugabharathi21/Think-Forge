
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

const Chat = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
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
      processChatLearningMessage(content);
    }
  };
  
  const processSubjectSelection = (content: string) => {
    const subjectMatch = subjects.find(
      subject => content.toLowerCase().includes(subject.toLowerCase())
    );
    
    setTimeout(() => {
      if (subjectMatch) {
        setSelectedSubject(subjectMatch);
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
  
  const processChatLearningMessage = (message: string) => {
    // In a real implementation, this would call an AI service
    // For now, we'll have some hard-coded responses based on keywords
    setTimeout(() => {
      let response = "";
      const lcMessage = message.toLowerCase();
      
      if (selectedSubject === 'Mathematics') {
        if (lcMessage.includes('derivative') || lcMessage.includes('calculus')) {
          response = "In calculus, a derivative measures how a function changes as its input changes. The process of finding a derivative is called differentiation. The derivative of a function f(x) is denoted as f'(x) or df/dx. For example, the derivative of f(x) = x² is f'(x) = 2x.";
        } else if (lcMessage.includes('trigonometry') || lcMessage.includes('sin') || lcMessage.includes('cos')) {
          response = "Trigonometry is the branch of mathematics dealing with the relations of the sides and angles of triangles. The main trigonometric functions are sine (sin), cosine (cos), and tangent (tan). For example, in a right triangle, sin(θ) equals the opposite side divided by the hypotenuse.";
        } else {
          response = "That's an interesting topic in mathematics. Could you ask me something more specific about it? I can help with algebra, calculus, geometry, trigonometry, and many other areas of mathematics.";
        }
      } else if (selectedSubject === 'Physics') {
        if (lcMessage.includes('newton') || lcMessage.includes('force') || lcMessage.includes('motion')) {
          response = "Newton's laws of motion are three laws that describe the relationship between the motion of an object and the forces acting on it. The first law states that an object will remain at rest or in uniform motion unless acted upon by an external force. The second law states that force equals mass times acceleration (F = ma). The third law states that for every action, there is an equal and opposite reaction.";
        } else if (lcMessage.includes('einstein') || lcMessage.includes('relativity')) {
          response = "Einstein's theory of relativity consists of two physical theories: special relativity and general relativity. Special relativity applies to all physical phenomena in the absence of gravity, while general relativity explains the law of gravitation and its relation to other forces of nature.";
        } else {
          response = "That's an interesting physics topic. Could you ask me something more specific about it? I can help with mechanics, thermodynamics, electromagnetism, quantum physics, and many other areas of physics.";
        }
      } else {
        response = `That's an interesting topic in ${selectedSubject}. Could you ask me something more specific about it so I can provide more detailed information?`;
      }
      
      const newAIMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsWaitingForAI(false);
    }, 2000);
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
