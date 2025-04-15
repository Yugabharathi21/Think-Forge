
import { Link } from 'react-router-dom';
import { BrainCircuit, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full glass-dark py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6 text-thinkforge-purple" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
                ThinkForge
              </span>
            </Link>
            <p className="text-sm text-foreground/70">
              Identify and improve your academic weak areas through AI-powered interactive quizzes.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground/70 hover:text-thinkforge-purple transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-thinkforge-purple transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium mb-2 text-thinkforge-violet">Product</h3>
            <Link to="/features" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Pricing
            </Link>
            <Link to="/testimonials" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Testimonials
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium mb-2 text-thinkforge-violet">Resources</h3>
            <Link to="/blog" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Blog
            </Link>
            <Link to="/faq" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              FAQ
            </Link>
            <Link to="/support" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Support
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium mb-2 text-thinkforge-violet">Legal</h3>
            <Link to="/privacy" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-foreground/70 hover:text-thinkforge-purple transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} ThinkForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
