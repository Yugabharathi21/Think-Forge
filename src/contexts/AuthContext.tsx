import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/lib/database';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      const sessionData = session as { user?: User } | null;
      setUser(sessionData?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Successfully signed in!');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    try {
      const { data, error } = await authService.signUp(email, password, fullName);
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Successfully signed up! Please check your email to verify your account.');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed out');
      }
    } catch (error) {
      toast.error('An error occurred while signing out');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
