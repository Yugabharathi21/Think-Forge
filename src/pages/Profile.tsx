import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Brain, 
  MessageSquare, 
  Target, 
  TrendingUp,
  BookOpen,
  Clock,
  Award,
  Activity
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, quizService } from '@/lib/database';
import type { UserProgress, ChatSession, QuizSession } from '@/lib/supabase';

interface ProfileStats {
  totalQuizzes: number;
  averageScore: number;
  totalChatSessions: number;
  totalStudyHours: number;
  subjectProgress: UserProgress[];
  recentActivity: (QuizSession | ChatSession)[];
  currentStreak: number;
  longestStreak: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch all user data in parallel
        const [
          userProgress,
          chatSessions,
          quizHistory
        ] = await Promise.all([
          quizService.getUserProgress(user.id),
          chatService.getUserSessions(user.id),
          quizService.getUserQuizHistory(user.id)
        ]);

        // Calculate statistics
        const totalQuizzes = quizHistory.length;
        const averageScore = totalQuizzes > 0 
          ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
          : 0;
        
        const totalChatSessions = chatSessions.length;
        
        // Estimate study hours (rough calculation based on activity)
        const totalStudyHours = Math.round(
          (totalQuizzes * 0.5) + (totalChatSessions * 0.25)
        );

        // Calculate current and longest streak based on activity frequency
        const currentStreak = calculateCurrentStreak(quizHistory, chatSessions);
        const longestStreak = calculateLongestStreak(quizHistory, chatSessions);

        // Combine recent activity (last 10 items)
        const recentQuizzes = quizHistory.slice(0, 5).map(quiz => ({
          ...quiz,
          type: 'quiz' as const
        }));
        
        const recentChats = chatSessions.slice(0, 5).map(chat => ({
          ...chat,
          type: 'chat' as const
        }));
        
        const recentActivity = [...recentQuizzes, ...recentChats]
          .sort((a, b) => {
            const aDate = 'completed_at' in a ? a.completed_at : a.updated_at;
            const bDate = 'completed_at' in b ? b.completed_at : b.updated_at;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
          })
          .slice(0, 10);

        setStats({
          totalQuizzes,
          averageScore,
          totalChatSessions,
          totalStudyHours,
          subjectProgress: userProgress,
          recentActivity,
          currentStreak,
          longestStreak
        });

      } catch (error) {
        console.error('❌ Failed to load user stats:', error);
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  const calculateCurrentStreak = (quizzes: QuizSession[], chats: ChatSession[]): number => {
    // Combine all activities
    const activities = [
      ...quizzes.map(q => q.completed_at),
      ...chats.map(c => c.updated_at)
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (activities.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < activities.length; i++) {
      const activityDate = new Date(activities[i]);
      activityDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (quizzes: QuizSession[], chats: ChatSession[]): number => {
    // This is a simplified calculation - in production you'd want more sophisticated streak tracking
    const activities = [
      ...quizzes.map(q => q.completed_at),
      ...chats.map(c => c.updated_at)
    ];

    if (activities.length === 0) return 0;
    
    // For now, return a simple calculation based on total activities
    return Math.min(Math.floor(activities.length / 3), 30); // Cap at 30 days
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-8">
              <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
              <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.email || '')}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user.email?.split('@')[0]}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(user.created_at || '')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email_confirmed_at ? 'Email Verified' : 'Email Pending'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={user.id || ''}
                    disabled
                    className="bg-muted font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastSignIn">Last Sign In</Label>
                  <Input
                    id="lastSignIn"
                    value={user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    value={user.role || 'User'}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
            <CardDescription>Your progress and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg border">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Quizzes Completed</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">0%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">0</div>
                <div className="text-sm text-muted-foreground">Chat Sessions</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">0</div>
                <div className="text-sm text-muted-foreground">Study Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
