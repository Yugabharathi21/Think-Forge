import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../hooks/useNavigation';
import { BrainCircuit, MessageSquare, History, Settings } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: 'Start a New Conversation',
      description: 'Begin a new chat session with Think Forge AI',
      action: () => navigation.toConversation('new'),
    },
    {
      icon: <History className="h-6 w-6 text-primary" />,
      title: 'View History',
      description: 'Access your past conversations and continue where you left off',
      action: () => navigation.toConversation('history'),
    },
    {
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: 'Settings',
      description: 'Customize your experience and manage your preferences',
      action: () => navigation.toConversation('settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-dark-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
              <BrainCircuit size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Think Forge
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-400">
            Hello, {user?.username}! Ready to start a new conversation or continue where you left off?
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-dark-lighter rounded-lg p-6 hover:bg-dark-lightest transition-colors duration-200 cursor-pointer"
                onClick={feature.action}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-dark-darker group-hover:bg-dark-lighter transition-colors duration-200">
                  {feature.icon}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 