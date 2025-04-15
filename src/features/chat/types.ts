
import { ReactNode } from 'react';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

export type MessageType = 'user' | 'ai' | 'system';

export interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

export interface MCQQuestionData {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}
