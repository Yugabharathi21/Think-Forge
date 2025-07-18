import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Index = () => {
  useEffect(() => {
    document.body.style.background = '#0a0a0a';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.background = '';
    };
  }, []);
  
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-crow text-white font-mono">
        <motion.div 
          className="absolute w-[500px] h-[500px] opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-flamePurple/20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-flamePurple/10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-flamePurple/5" />
        </motion.div>
        
        <div className="text-center z-10 border border-border bg-glass backdrop-blur-sm p-12 max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to <span className="text-transparent bg-clip-text bg-flame-gradient">ThinkForge</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-white/70 mb-8 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Enhance your learning journey with AI-powered insights and personalized feedback
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/signup">
              <Button className="bg-flamePurple hover:bg-flamePurple-light rounded-none px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-flamePurple/50 hover:border-flamePurple hover:bg-flamePurple/10 rounded-none px-8 py-6">
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
