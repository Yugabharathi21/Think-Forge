import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Trophy, 
  BarChart3, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/ui/ProfileCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const { isAuthenticated } = useAuth();

  // Smart navigation based on authentication status
  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleSignUp = () => {
    if (isAuthenticated) {
      navigate('/progress');
    } else {
      navigate('/signup');
    }
  };

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "AI Chat Tutor",
      description: "Get instant help with personalized AI conversations that adapt to your learning style.",
      color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with smart quizzes that help reinforce what you've learned.",
      color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500 dark:text-green-400" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievement tracking.",
      color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      title: "Multiple Subjects",
      description: "Learn across various subjects with specialized AI tutors for each domain.",
      color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Learning", icon: <Users className="w-5 h-5" /> },
    { number: "50+", label: "Subjects Available", icon: <BookOpen className="w-5 h-5" /> },
    { number: "95%", label: "Success Rate", icon: <Target className="w-5 h-5" /> },
    { number: "24/7", label: "AI Support", icon: <Zap className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "Think-Forge AI helped me understand complex algorithms in ways my textbooks never could!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "High School Student",
      content: "The interactive quizzes made studying for my exams so much more engaging and effective.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Medical Student",
      content: "Having an AI tutor available 24/7 has been a game-changer for my medical studies.",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "Yuga Bharathi J",
      title: "Developer",
      handle: "Front-end & Backend",
      status: "Online",
      contactText: "Connect",
      ConnectLink : "Yugabharathi21.netlify.app",
      avatarUrl: "/ybj.png"
    },
    {
      name: "Shaswatth D",
      title: "AI Engineer",
      handle: "ML and Ollama",
      status: "Online",
      contactText: "Connect",
      ConnectLink : "www.github.com/IamShaswatth",
      avatarUrl: "/sha.png"
    },
    {
      name: "Dharsan S P",
      title: "Database Admin",
      handle: "Database",
      status: "Online",
      contactText: "Connect",
      ConnectLink : "https://github.com/Dharsan5",
      avatarUrl: "/dsp.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn Smarter with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                AI-Powered Education
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience personalized learning with our advanced AI tutor. Get instant help, 
              take interactive quizzes, and track your progress across multiple subjects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartLearning}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-lg px-8 py-3"
              >
                {isAuthenticated ? 'Continue Learning' : 'Start Learning Now'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleSignUp}
                className="text-lg px-8 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200"
              >
                {isAuthenticated ? 'View Progress' : 'Sign Up Free'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-2 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Think-Forge AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven educational methods 
              to deliver a personalized learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 hover:shadow-lg dark:hover:shadow-xl transition-shadow dark:bg-gray-800/50`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 dark:text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                The Future of Learning is Here
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Think-Forge AI revolutionizes education by providing personalized, 
                interactive learning experiences powered by advanced artificial intelligence. 
                Our platform adapts to your learning style and pace, ensuring optimal knowledge retention.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Personalized AI tutoring for every student</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time progress tracking and analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Interactive quizzes and instant feedback</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border dark:border-gray-700">
              <div className="text-center">
                <Brain className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Join thousands of students who are already learning smarter with AI.
                </p>
                <Button 
                  onClick={handleStartLearning}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {isAuthenticated ? 'Continue Your Journey' : 'Start Your Learning Journey'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real feedback from students who transformed their learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-colors dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 dark:text-gray-300 text-base">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
<section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Meet Our Team
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        The brilliant minds behind Think-Forge AI, working together to revolutionize education.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-28 lg:gap-32 justify-items-center max-w-6xl mx-auto">
      {teamMembers.slice(0, 3).map((member, index) => (
        <div key={index} className="w-full max-w-sm mb-16">
          <ProfileCard
            name={member.name}
            title={member.title}
            handle={member.handle}
            status={member.status}
            contactText={member.contactText}
            avatarUrl={member.avatarUrl}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => {
              if (member.ConnectLink) {
                // Add https:// if not present
                const url = member.ConnectLink.startsWith('http') 
                  ? member.ConnectLink 
                  : `https://${member.ConnectLink}`;
                window.open(url, '_blank');
              }
            }}
          />
        </div>
      ))}
    </div>
   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-28 lg:gap-32 justify-items-center max-w-4xl mx-auto mt-16">
      {teamMembers.slice(3, 5).map((member, index) => (
        <div key={index + 3} className="w-full max-w-sm mb-16">
          <ProfileCard
            name={member.name}
            title={member.title}
            handle={member.handle}
            status={member.status}
            contactText={member.contactText}
            avatarUrl={member.avatarUrl}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => {
              if (member.ConnectLink) {
                // Add https:// if not present
                const url = member.ConnectLink.startsWith('http') 
                  ? member.ConnectLink 
                  : `https://${member.ConnectLink}`;
                window.open(url, '_blank');
              }
            }}
          />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            Join thousands of students who are already experiencing the future of education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleStartLearning}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              {isAuthenticated ? 'Continue Learning' : 'Start Learning Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleSignUp}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
            >
              {isAuthenticated ? 'View Progress' : 'Create Account'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
