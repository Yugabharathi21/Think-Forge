
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    document.body.style.background = '#0a0a0a';
    return () => {
      document.body.style.background = '';
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-crow p-4 font-mono text-white">
      <motion.div 
        className="border border-flamePurple bg-glass backdrop-blur-sm p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-flame-gradient mb-2 tracking-tight">404</h1>
          <p className="text-xl font-semibold mb-4 tracking-tight">Page Not Found</p>
          <p className="text-white/70 text-sm mb-8 tracking-wide">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-flamePurple hover:bg-flamePurple-light rounded-none">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
