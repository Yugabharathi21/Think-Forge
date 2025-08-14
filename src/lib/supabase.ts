import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  subject: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
}

export interface QuizSession {
  id: string;
  user_id: string;
  subject: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  difficulty?: string;
  completed_at: string;
}

export interface QuizQuestionResult {
  id?: string;
  quiz_session_id: string;
  user_id?: string;
  question_id: string;
  question_text: string;
  correct_option: number;
  user_answer: number;
  is_correct: boolean;
  explanation?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  subject: string;
  total_sessions: number;
  total_questions_answered: number;
  correct_answers: number;
  average_score: number;
  last_activity: string;
}

export interface ChartDataPoint {
  name: string;
  score: number;
  // Allow additional numeric properties (e.g., for multiple datasets)
  [key: string]: string | number;
}

export interface SubjectDataPoint {
  name: string;
  value: number;
}

export interface WeeklyProgressPoint {
  name: string;
  week: string;
  score: number;
  sessions: number;
}

export interface TopicDataPoint {
  name: string;
  score: number;
}

export interface ProgressChartData {
  weeklyProgress: WeeklyProgressPoint[];
  subjectDistribution: SubjectDataPoint[];
  topicStrengths: TopicDataPoint[];
  topicWeaknesses: TopicDataPoint[];
  recentActivity: QuizSession[];
  totalSessions: number;
  totalQuestions: number;
  averageScore: number;
}
