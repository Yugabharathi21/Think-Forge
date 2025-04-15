
import { useState } from 'react';
import { subjects, sampleMCQs } from '../constants';
import { Message } from '../types';
import { toast } from "sonner";

export const useChatLogic = () => {
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
        toast(`Now learning: ${subjectMatch}`);
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

  return {
    messages,
    isWaitingForAI,
    selectedSubject,
    handleSendMessage
  };
};
