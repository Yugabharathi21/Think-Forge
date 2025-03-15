import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    toConversation: (id: string) => {
      if (id === 'new') {
        // Create a new conversation and navigate to it
        // For now, just navigate to the chat page
        navigate('/chat');
      } else if (id === 'history') {
        // Navigate to history page
        navigate('/history');
      } else if (id === 'settings') {
        // Navigate to settings page
        navigate('/settings');
      } else {
        // Navigate to specific conversation
        navigate(`/c/${id}`);
      }
    },
    toLogin: () => navigate('/login'),
    toRegister: () => navigate('/register'),
    toHome: () => navigate('/'),
    toChat: () => navigate('/chat'),
    toHistory: () => navigate('/history'),
    toSettings: () => navigate('/settings'),
  };
}; 