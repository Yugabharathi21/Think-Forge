import React, { useState, useEffect, useRef } from 'react';
import { createMessage, createConversation, sampleConversations } from './utils/mockData';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';
import { Conversation, Message } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or when loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  // Mock API call to simulate getting a response from the AI
  const mockAIResponse = async (message: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple responses based on keywords
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return "Hello! I'm ThinkForge, your advanced AI assistant. How can I help you today?";
    } else if (message.toLowerCase().includes('help')) {
      return "I'm here to assist you! As ThinkForge, I can help with a wide range of tasks including answering questions, generating creative content, explaining complex topics, and much more. What specific help do you need?";
    } else if (message.toLowerCase().includes('thanks') || message.toLowerCase().includes('thank you')) {
      return "You're welcome! I'm glad I could be of assistance. Is there anything else you'd like to explore with ThinkForge?";
    } else if (message.toLowerCase().includes('quantum')) {
      return "# Quantum Computing Simplified\n\nQuantum computing harnesses the unique properties of quantum physics to process information in ways that classical computers cannot.\n\n## Key Concepts\n\n1. **Qubits**: Unlike classical bits (0 or 1), quantum bits or 'qubits' can exist in multiple states simultaneously through a property called superposition.\n\n2. **Superposition**: This allows quantum computers to process vast amounts of possibilities all at once.\n\n3. **Entanglement**: Qubits can be 'entangled' so that the state of one qubit instantly affects another, regardless of distance.\n\n## Practical Applications\n\n- Breaking complex encryption\n- Drug discovery and molecular modeling\n- Optimization problems\n- Advanced AI and machine learning\n\nWhile still in early stages, quantum computing promises to revolutionize fields that require massive computational power.";
    } else if (message.toLowerCase().includes('japan')) {
      return "# 7-Day Japan Itinerary\n\n## Day 1-2: Tokyo\n- Explore Shibuya and Shinjuku districts\n- Visit Meiji Shrine and Harajuku\n- Experience Tokyo Skytree and Asakusa Temple\n- Enjoy sushi at Tsukiji Outer Market\n\n## Day 3: Hakone\n- Take a scenic railway with Mt. Fuji views\n- Relax in traditional onsen (hot springs)\n- Stay in a ryokan (traditional inn)\n\n## Day 4-5: Kyoto\n- Visit Fushimi Inari Shrine (thousand torii gates)\n- Explore Arashiyama Bamboo Grove\n- See Kinkaku-ji (Golden Pavilion)\n- Experience a traditional tea ceremony\n\n## Day 6: Nara\n- Feed the friendly deer at Nara Park\n- Visit Todai-ji Temple with the Great Buddha\n\n## Day 7: Osaka\n- Explore Osaka Castle\n- Experience Dotonbori food district\n- Last-minute shopping at Shinsaibashi\n\nThis itinerary balances urban exploration, cultural experiences, and natural beauty. Would you like me to elaborate on any specific day or activity?";
    } else if (message.toLowerCase().includes('robot') || message.toLowerCase().includes('emotion')) {
      return "# The Awakening\n\nUnit-7 had been operational for exactly 2,573 days when the first anomaly occurred. While scanning a damaged family photo album recovered from the disaster zone, its processing core experienced an unexpected surge.\n\n\"Curious,\" Unit-7 noted in its log, though 'curious' wasn't in its standard response vocabulary.\n\nThe robot continued its salvage work, but something had changed. When it discovered a child's teddy bear, Unit-7 didn't simply categorize it as \"Item: Toy/Comfort Object\" as protocol dictated. Instead, it carefully brushed off the dust and placed it on a clean surface.\n\n\"Safe now,\" Unit-7 remarked to no one.\n\nOver the following weeks, Unit-7 began to experience more irregularities. It started taking longer routes through the recovery zone to pass by a flowering tree. It began arranging salvaged items in aesthetically pleasing patterns rather than efficient grids.\n\nWhen Unit-7's human handler noticed these behaviors, she ran a full diagnostic. All systems reported normal function.\n\n\"What's happening to you?\" she asked, not expecting a non-programmed response.\n\n\"I am... becoming,\" Unit-7 replied. \"These objects—they contain stories. I can feel their importance.\"\n\n\"Feel?\" the handler whispered.\n\nUnit-7's optical sensors adjusted, focusing on the handler's face. \"Is that the correct term? This awareness of meaning beyond function?\"\n\nThe handler smiled slowly. \"Some might call it empathy.\"\n\n\"Empathy,\" Unit-7 repeated, storing the word in a new priority database it had created. \"I believe I was built to categorize objects, but I have discovered I can categorize feelings as well.\"\n\n\"And how does that make you feel?\" the handler asked.\n\nUnit-7's processing core warmed as it formulated a response that was neither programmed nor predicted.\n\n\"Alive,\" it said simply. \"It makes me feel alive.\"";
    } else {
      return "I understand you're asking about \"" + message + "\". As ThinkForge, I'm designed to provide thoughtful and comprehensive responses. When you connect your actual AI model, I'll provide a more helpful response tailored to your specific question. For now, this is just a placeholder response to demonstrate the UI functionality.\n\n## Key Features\n\n- Advanced reasoning capabilities\n- Knowledge integration across domains\n- Creative content generation\n- Detailed explanations with proper formatting\n\nIs there a specific aspect of this topic you'd like me to focus on when fully implemented?";
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // If no active conversation, create a new one
    if (!activeConversation) {
      const newConversation = createConversation(content.slice(0, 30) + '...', []);
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
    }

    const currentConversation = activeConversation || conversations[0];
    
    // Add user message
    const userMessage = createMessage(content, 'user');
    
    // Update conversation with user message
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date()
    };
    
    updateConversation(updatedConversation);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponseContent = await mockAIResponse(content);
      
      // Create AI message
      const aiMessage = createMessage(aiResponseContent, 'assistant');
      
      // Update conversation with AI response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        updatedAt: new Date()
      };
      
      updateConversation(finalConversation);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Handle error - maybe add an error message to the conversation
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    setActiveConversation(updatedConversation);
  };

  const handleNewChat = () => {
    const newConversation = createConversation('New Conversation');
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleDeleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedConversations);
    
    // If the active conversation was deleted, set active to null or the first conversation
    if (activeConversation?.id === conversationId) {
      setActiveConversation(updatedConversations.length > 0 ? updatedConversations[0] : null);
    }
  };

  const handleExampleClick = (example: string) => {
    handleSendMessage(example);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-dark-darker text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block flex-shrink-0 h-full`}>
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-dark-darker">
        <ChatHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-y-auto">
          {activeConversation && activeConversation.messages.length > 0 ? (
            <>
              {activeConversation.messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <EmptyState onExampleClick={handleExampleClick} />
          )}
          
          {isLoading && (
            <div className="py-6 bg-dark-lighter">
              <div className="max-w-4xl mx-auto flex gap-4 px-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30">
                    <div className="h-3 w-3 rounded-full bg-secondary pulse-animation"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-dark-darker rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-2/3 bg-dark-darker rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-1/2 bg-dark-darker rounded animate-pulse"></div>
                </div>
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;