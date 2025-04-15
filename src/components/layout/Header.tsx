
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/progress" className="text-sm text-foreground/80 hover:text-thinkforge-purple transition-colors">
            Progress
          </Link>
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
              to="/progress" 
              className="text-sm py-2 px-4 hover:bg-thinkforge-purple/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
