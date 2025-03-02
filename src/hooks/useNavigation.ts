import { useNavigate } from 'react-router-dom';
import { createNavigation } from '../utils/navigation';

export function useNavigation() {
  const navigate = useNavigate();
  return createNavigation(navigate);
} 