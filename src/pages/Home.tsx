import { Link } from 'react-router-dom';
import { ArrowRight, Brain, LineChart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-28 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-thinkforge-purple/20 rounded-full filter blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-thinkforge-purple/10 rounded-full filter blur-3xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Enhance Your Learning with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet block mt-2">
              AI-Powered Insights
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ThinkForge helps students identify and improve weak academic areas through interactive quizzes and real-time AI-powered feedback.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/signup">
              <Button size="lg" className="bg-thinkforge-purple hover:bg-thinkforge-purple/90 rounded-md px-8 py-6 text-base">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-thinkforge-purple/50 hover:border-thinkforge-purple hover:bg-thinkforge-purple/10 rounded-md px-8 py-6 text-base">
                Try Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
              Key Features
            </span>
          </motion.h2>
          <motion.p
            className="text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Designed to revolutionize the way students learn and improve their academic performance
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <motion.div
            className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6">
              <Brain className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Chatbot for Quizzes</h3>
            <p className="text-sm text-foreground/70">
              Engage in real-time Q&A with an intelligent AI that evaluates responses and offers personalized feedback.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6">
              <LineChart className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-sm text-foreground/70">
              Dynamic visual charts to showcase strengths and areas for improvement with detailed performance analytics.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6">
              <Zap className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Seamless Experience</h3>
            <p className="text-sm text-foreground/70">
              Lightning-fast performance, smooth animations, and an ultra-responsive interface optimized for all devices.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
              How It Works
            </span>
          </motion.h2>
          <motion.p
            className="text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Simple steps to improve your academic performance
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">1</div>
              <motion.h3
                className="text-xl font-semibold mb-3 mt-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Take Interactive Quizzes
              </motion.h3>
              <motion.p
                className="text-sm text-foreground/70"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Engage with our AI-powered quiz system that adapts to your knowledge level and learning style.
              </motion.p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">2</div>
              <motion.h3
                className="text-xl font-semibold mb-3 mt-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Receive Real-time Feedback
              </motion.h3>
              <motion.p
                className="text-sm text-foreground/70"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Get instant analysis and personalized suggestions to improve your understanding of difficult concepts.
              </motion.p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">3</div>
              <motion.h3
                className="text-xl font-semibold mb-3 mt-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Track Your Progress
              </motion.h3>
              <motion.p
                className="text-sm text-foreground/70"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Visualize your improvement over time with detailed charts and analytics that highlight your growth.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-24"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="glass-card p-12 rounded-xl neon-border max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to transform your learning experience?
          </motion.h2>
          <motion.p
            className="text-foreground/70 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of students who are already improving their academic performance with ThinkForge.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/signup">
              <Button size="lg" className="bg-thinkforge-purple hover:bg-thinkforge-purple/90 rounded-md px-8 py-6 text-base">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
