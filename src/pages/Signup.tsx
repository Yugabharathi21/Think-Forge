
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await signUp(email, password, name);
    
    if (success) {
      navigate('/login');
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10">
        <div className="w-full max-w-md px-4">
          <div className="glass-card p-8 rounded-xl neon-border animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
              <p className="text-sm text-foreground/70">
                Join ThinkForge and start improving your academic performance
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 glass-dark border-foreground/10 focus:border-thinkforge-purple"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    className="pl-10 glass-dark border-foreground/10 focus:border-thinkforge-purple"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 glass-dark border-foreground/10 focus:border-thinkforge-purple"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-foreground/50 hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-foreground/50 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-thinkforge-purple hover:bg-thinkforge-purple/90 shine-animation"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="relative flex items-center justify-center mt-6">
                <div className="border-t border-foreground/10 absolute w-full"></div>
                <span className="bg-thinkforge-black px-4 z-10 text-xs text-foreground/50">OR CONTINUE WITH</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="glass-dark border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-foreground/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-thinkforge-purple hover:text-thinkforge-purple/90">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
