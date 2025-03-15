import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Conversation {
  _id: string;
  title: string;
  lastActivity: string;
}

export const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const createConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await api.post('/conversations', { title: newTitle });
      const newConversation = response.data.data;
      navigate(`/conversations/${newConversation._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Conversations</h1>

      <form onSubmit={createConversation} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter conversation title..."
            className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Create New
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => navigate(`/conversations/${conversation._id}`)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
          >
            <h2 className="font-semibold mb-2">{conversation.title}</h2>
            <p className="text-sm text-gray-500">
              Last active: {new Date(conversation.lastActivity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}; 