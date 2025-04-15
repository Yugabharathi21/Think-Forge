
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, LineChart, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-thinkforge-purple/20 rounded-full filter blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-thinkforge-purple/10 rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            Enhance Your Learning with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet block mt-2">
              AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            ThinkForge helps students identify and improve weak academic areas through interactive quizzes and real-time AI-powered feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/signup">
              <Button size="lg" className="bg-thinkforge-purple hover:bg-thinkforge-purple/90 rounded-md px-8 py-6 text-base shine-animation">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-thinkforge-purple/50 hover:border-thinkforge-purple hover:bg-thinkforge-purple/10 rounded-md px-8 py-6 text-base">
                Try Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-20 w-full max-w-5xl glass-card p-1 rounded-2xl neon-border pixel-corners animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="rounded-xl overflow-hidden">
              <img 
                src="https://ik.imagekit.io/p50/learnventor-assistant.png" 
                alt="ThinkForge AI Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
              Key Features
            </span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Designed to revolutionize the way students learn and improve their academic performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6 group-hover:bg-thinkforge-purple/30 transition-colors">
              <Brain className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Chatbot for Quizzes</h3>
            <p className="text-sm text-foreground/70">
              Engage in real-time Q&A with an intelligent AI that evaluates responses and offers personalized feedback.
            </p>
          </div>

          <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6 group-hover:bg-thinkforge-purple/30 transition-colors">
              <LineChart className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-sm text-foreground/70">
              Dynamic visual charts to showcase strengths and areas for improvement with detailed performance analytics.
            </p>
          </div>

          <div className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:neon-border transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-thinkforge-purple/20 mb-6 group-hover:bg-thinkforge-purple/30 transition-colors">
              <Zap className="h-8 w-8 text-thinkforge-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Seamless Experience</h3>
            <p className="text-sm text-foreground/70">
              Lightning-fast performance, smooth animations, and an ultra-responsive interface optimized for all devices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-thinkforge-purple to-thinkforge-violet">
              How It Works
            </span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Simple steps to improve your academic performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">1</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Take Interactive Quizzes</h3>
              <p className="text-sm text-foreground/70">
                Engage with our AI-powered quiz system that adapts to your knowledge level and learning style.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">2</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Receive Real-time Feedback</h3>
              <p className="text-sm text-foreground/70">
                Get instant analysis and personalized suggestions to improve your understanding of difficult concepts.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-thinkforge-purple flex items-center justify-center font-bold text-white">3</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Track Your Progress</h3>
              <p className="text-sm text-foreground/70">
                Visualize your improvement over time with detailed charts and analytics that highlight your growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="glass-card p-12 rounded-xl neon-border max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to transform your learning experience?</h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Join thousands of students who are already improving their academic performance with ThinkForge.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-thinkforge-purple hover:bg-thinkforge-purple/90 rounded-md px-8 py-6 text-base">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
