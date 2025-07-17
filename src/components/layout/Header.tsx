
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="w-full fixed top-0 z-50 glass-dark py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-thinkforge-purple" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
            ThinkForge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm text-foreground/80 hover:text-thinkforge-purple transition-colors">
            Home
          </Link>
          <Link to="/chat" className="text-sm text-foreground/80 hover:text-thinkforge-purple transition-colors">
            AI Chat
          </Link>
          <Link to="/mcq-quiz" className="text-sm text-foreground/80 hover:text-thinkforge-purple transition-colors">
            MCQ Quiz
          </Link>
          <Link to="/progress" className="text-sm text-foreground/80 hover:text-thinkforge-purple transition-colors">
            Progress
          </Link>
          
          {/* Conditional Authentication Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-thinkforge-purple/10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-thinkforge-purple text-white text-xs">
                      {user?.email ? getInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user?.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="outline" className="text-sm border-thinkforge-purple/50 hover:border-thinkforge-purple hover:bg-thinkforge-purple/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="text-sm bg-thinkforge-purple hover:bg-thinkforge-purple/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark absolute top-full left-0 right-0 p-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/chat" 
              className="text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Chat
            </Link>
            <Link 
              to="/mcq-quiz" 
              className="text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              MCQ Quiz
            </Link>
            <Link 
              to="/progress" 
              className="text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
            
            {/* Conditional Mobile Authentication Section */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-thinkforge-purple/20">
                <div className="flex items-center space-x-3 py-2 px-4 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-thinkforge-purple text-white text-xs">
                      {user?.email ? getInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
                    <span className="text-xs text-foreground/60">{user?.email}</span>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-2 text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <button 
                  className="flex items-center space-x-2 w-full text-sm py-2 px-4 hover:bg-red-500/10 rounded-md transition-colors text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-thinkforge-purple/20">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm border-thinkforge-purple/50 hover:border-thinkforge-purple hover:bg-thinkforge-purple/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full text-sm bg-thinkforge-purple hover:bg-thinkforge-purple/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
