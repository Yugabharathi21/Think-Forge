
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.background = '#0a0a0a';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await signIn(email, password);
    
    if (success) {
      // Redirect to intended destination or default to /chat
      const locationState = location.state as { from?: { pathname: string } } | null;
      const from = locationState?.from?.pathname || '/chat';
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10 bg-crow relative">
        <div className="absolute -top-10 -left-20 w-64 h-64 bg-flame-gradient blur-3xl opacity-20 -z-10 transform rotate-12"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-flame-gradient blur-3xl opacity-10 -z-10 transform -rotate-12"></div>
        
        <motion.div 
          className="w-full max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="border border-flamePurple bg-glass backdrop-blur-sm p-8 font-mono text-white">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-flame-gradient tracking-tight">Welcome Back</h1>
              <p className="text-sm text-white/70">
                Login to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    className="pl-10 bg-crow/50 border-flamePurple/30 focus:border-flamePurple text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-flamePurple hover:text-flamePurple-light"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-crow/50 border-flamePurple/30 focus:border-flamePurple text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-white/50 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-flamePurple hover:bg-flamePurple-light text-white rounded-none"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative flex items-center justify-center mt-6">
                <div className="border-t border-flamePurple/20 absolute w-full"></div>
                <span className="bg-crow px-4 z-10 text-xs text-white/50">OR CONTINUE WITH</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="bg-crow/50 border-flamePurple/30 hover:border-flamePurple/50 hover:bg-crow/70 text-white">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-white/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-flamePurple hover:text-flamePurple-light">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
