import { supabase } from './supabase';
import type { User, ChatSession, ChatMessage, QuizSession, UserProgress } from './supabase';
import type { MCQQuestionData } from '@/features/chat/types';

// Database connection test
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔄 Testing Supabase database connection...');
    
    const { data, error } = await supabase.from('chat_sessions').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
};

// Authentication Services
export const authService = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    console.log('🔐 Getting current user...');
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Error getting current user:', error);
        return { user: null, error };
      }
      
      if (user) {
        console.log('✅ Current user found:', user.email);
      } else {
        console.log('ℹ️ No current user session');
      }
      
      return { user, error: null };
    } catch (error) {
      console.error('❌ Unexpected error getting user:', error);
      return { user: null, error: error as Error };
    }
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    console.log('🔐 Setting up auth state listener...');
    return supabase.auth.onAuthStateChange((event, session) => {
      const sessionData = session as { user?: { email?: string } } | null;
      console.log('🔐 Auth state changed:', event, sessionData?.user?.email || 'No user');
      callback(event, session);
    });
  },
};

// Chat Services
export const chatService = {
  async createSession(userId: string, subject: string, title: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        subject,
        title,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
    return data;
  },

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
    return data || [];
  },

  async addMessage(sessionId: string, content: string, role: 'user' | 'assistant' | 'system'): Promise<ChatMessage | null> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }
    return data;
  },

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  },

  async updateSessionTitle(sessionId: string, title: string) {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session title:', error);
    }
  },
};

// Quiz Services
export const quizService = {
  async saveQuizResult(
    userId: string,
    subject: string,
    totalQuestions: number,
    correctAnswers: number,
    questions: MCQQuestionData[],
    userAnswers: number[]
  ): Promise<QuizSession | null> {
    console.log('💾 Saving quiz result to database...', {
      userId,
      subject,
      totalQuestions,
      correctAnswers,
      score: Math.round((correctAnswers / totalQuestions) * 100)
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: userId,
          subject,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          score,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error saving quiz result:', error);
        return null;
      }

      console.log('✅ Quiz result saved successfully');

      // Update user progress
      await this.updateUserProgress(userId, subject, totalQuestions, correctAnswers);
      
      // Save detailed quiz analysis
      await this.saveQuizAnalysis(data.id, questions, userAnswers);
      
      return data;
    } catch (error) {
      console.error('❌ Unexpected error saving quiz result:', error);
      return null;
    }
  },

  async saveQuizAnalysis(
    quizSessionId: string,
    questions: MCQQuestionData[],
    userAnswers: number[]
  ): Promise<void> {
    console.log('📊 Saving detailed quiz analysis...');
    
    try {
      // Save individual question results
      const questionResults = questions.map((question, index) => ({
        quiz_session_id: quizSessionId,
        question_id: question.id,
        question_text: question.question,
        correct_option: question.correctOption,
        user_answer: userAnswers[index],
        is_correct: userAnswers[index] === question.correctOption,
        explanation: question.explanation
      }));

      const { error } = await supabase
        .from('quiz_question_results')
        .insert(questionResults);

      if (error) {
        console.error('❌ Error saving question results:', error);
      } else {
        console.log('✅ Quiz analysis saved successfully');
      }
    } catch (error) {
      console.error('❌ Unexpected error saving quiz analysis:', error);
    }
  },

  async getUserQuizHistory(userId: string): Promise<QuizSession[]> {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }
    return data || [];
  },

  async updateUserProgress(
    userId: string,
    subject: string,
    questionsAnswered: number,
    correctAnswers: number
  ) {
    // First, get existing progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)
      .single();

    if (existingProgress) {
      // Update existing progress
      const newTotalQuestions = existingProgress.total_questions_answered + questionsAnswered;
      const newCorrectAnswers = existingProgress.correct_answers + correctAnswers;
      const newAverageScore = Math.round((newCorrectAnswers / newTotalQuestions) * 100);

      await supabase
        .from('user_progress')
        .update({
          total_sessions: existingProgress.total_sessions + 1,
          total_questions_answered: newTotalQuestions,
          correct_answers: newCorrectAnswers,
          average_score: newAverageScore,
          last_activity: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress record
      const averageScore = Math.round((correctAnswers / questionsAnswered) * 100);

      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          subject,
          total_sessions: 1,
          total_questions_answered: questionsAnswered,
          correct_answers: correctAnswers,
          average_score: averageScore,
          last_activity: new Date().toISOString(),
        });
    }
  },

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity', { ascending: false });

    if (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
    return data || [];
  },
};
