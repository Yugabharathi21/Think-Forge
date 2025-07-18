import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import MCQQuestion from '@/components/chat/MCQQuestion';
import { subjects } from '@/features/chat/constants';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { BookOpen, ArrowRight, Brain, Loader2, Target, TrendingUp } from 'lucide-react';
import { generateQuizQuestions, analyzeMistake, analyzeQuizPerformance } from '@/lib/ollama';
import { quizService, testDatabaseConnection } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { MCQQuestionData } from '@/features/chat/types';
import { motion } from 'framer-motion';

const MCQQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [subject, setSubject] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questions, setQuestions] = useState<MCQQuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnalysis, setQuizAnalysis] = useState<{
    overallScore: number;
    weakAreas: string[];
    strongAreas: string[];
    recommendations: string[];
    detailedAnalysis: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      subject: '',
    },
  });

  // Test connections on component mount
  useEffect(() => {
    const testConnections = async () => {
      console.log('🚀 MCQ Quiz component mounted - testing connections...');
      
      // Test database connection
      await testDatabaseConnection();
      
      // Test Ollama connection
      try {
        console.log('🔄 Testing Ollama connection...');
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Ollama connected successfully!');
          console.log('🤖 Available models:', data.models?.map((m: { name: string }) => m.name) || []);
          
          // Test generation capability
          const testGenResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'mistral:7b',
              prompt: 'Test: Generate a simple math question',
              stream: false
            })
          });
          
          if (testGenResponse.ok) {
            const testData = await testGenResponse.json();
            console.log('✅ Ollama generation test successful!');
            console.log('📄 Test response:', testData.response);
          } else {
            console.log('❌ Ollama generation test failed:', testGenResponse.status);
          }
        } else {
          console.log('❌ Ollama connection failed:', response.status);
        }
      } catch (error) {
        console.log('❌ Ollama connection error:', error);
      }
      
      console.log('🎯 Ready to generate questions with Ollama when needed');
    };
    
    testConnections();
  }, []);

  const currentQuestion = questions[currentQuestionIdx];

  const handleSubjectSelection = (selectedSubject: string) => {
    console.log('📚 Subject selected:', selectedSubject);
    setSubject(selectedSubject);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIdx(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setScore({ correct: 0, total: 0 });
    setMistakeAnalysis(null);
    setQuizAnalysis(null);
    setIsAnswerSubmitted(false);
  };

  const startQuiz = async () => {
    if (!subject) return;
    
    console.log(`🎯 Starting ${difficulty} quiz for ${subject}...`);
    setLoading(true);
    
    try {
      const generatedQuestions = await generateQuizQuestions(subject, 5, difficulty);
      
      if (generatedQuestions.length === 0) {
        toast({
          title: "No Questions Available",
          description: `No questions found for ${subject}. Please try a different subject.`,
          variant: "destructive",
        });
        return;
      }
      
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(-1));
      setQuizStarted(true);
      setQuizCompleted(false);
      setCurrentQuestionIdx(0);
      setScore({ correct: 0, total: 0 });
      setMistakeAnalysis(null);
      setQuizAnalysis(null);
      setIsAnswerSubmitted(false);
      
      console.log(`✅ Quiz started with ${generatedQuestions.length} questions`);
      
      toast({
        title: "Quiz Started!",
        description: `${generatedQuestions.length} questions loaded for ${subject}`,
      });
    } catch (error) {
      console.error('❌ Error starting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMCQAnswer = async (wasCorrect: boolean, selectedOptionIndex: number) => {
    if (isAnswerSubmitted) return; // Prevent multiple submissions
    
    console.log(`📝 Answer submitted: ${wasCorrect ? 'Correct' : 'Incorrect'} (Option ${selectedOptionIndex})`);
    
    setIsAnswerSubmitted(true);
    
    // Store user answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIdx] = selectedOptionIndex;
    setUserAnswers(newUserAnswers);
    
    // Update score
    setScore(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    // Show toast notification
    if (wasCorrect) {
      toast({
        title: "Correct! ✅",
        description: "Well done on getting that right!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Incorrect ❌",
        description: "Let me analyze what went wrong...",
        duration: 3000,
      });

      // Analyze the mistake
      try {
        const analysis = await analyzeMistake(currentQuestion, selectedOptionIndex, user?.id);
        setMistakeAnalysis(analysis);
        console.log('🔍 Mistake analysis completed');
      } catch (error) {
        console.error('❌ Error analyzing mistake:', error);
        setMistakeAnalysis('The correct answer is explained in the question explanation above.');
      }
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIdx(prev => prev + 1);
      setMistakeAnalysis(null);
      setIsAnswerSubmitted(false);
      console.log(`➡️ Moving to question ${currentQuestionIdx + 2}/${questions.length}`);
    } else {
      // Quiz completed - analyze performance and save results
      console.log('🏁 Quiz completed! Analyzing performance...');
      
      await completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!subject || !user) {
      setQuizCompleted(true);
      return;
    }

    setSaving(true);
    
    try {
      // Generate comprehensive analysis
      console.log('📊 Generating quiz analysis...');
      const analysis = await analyzeQuizPerformance(subject, questions, userAnswers, user.id);
      setQuizAnalysis(analysis);
      
      // Save quiz results to database
      console.log('💾 Saving quiz results to database...');
      await quizService.saveQuizResult(
        user.id,
        subject,
        questions.length,
        score.correct,
        questions,
        userAnswers
      );
      
      setQuizCompleted(true);
      
      toast({
        title: "Quiz Completed! 🎉",
        description: `Final Score: ${score.correct}/${questions.length} (${analysis.overallScore}%)`,
        duration: 5000,
      });
      
      console.log('✅ Quiz completion process finished');
      
    } catch (error) {
      console.error('❌ Error completing quiz:', error);
      toast({
        title: "Quiz Completed",
        description: `Your score: ${score.correct}/${questions.length}`,
        duration: 5000,
      });
      setQuizCompleted(true);
    } finally {
      setSaving(false);
    }
  };

  const exitQuiz = () => {
    setQuizStarted(false);
    setSubject(null);
    setQuestions([]);
    setCurrentQuestionIdx(0);
    setScore({ correct: 0, total: 0 });
    setMistakeAnalysis(null);
    setIsAnswerSubmitted(false);
  };

  useEffect(() => {
    document.body.style.background = '#0a0a0a';
    return () => {
      document.body.style.background = '';
    };
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto py-8 bg-crow relative">
        <div className="absolute -top-10 -left-20 w-64 h-64 bg-flame-gradient blur-3xl opacity-20 -z-10 transform rotate-12"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-flame-gradient blur-3xl opacity-10 -z-10 transform -rotate-12"></div>
        
        <motion.div 
          className="border border-flamePurple bg-glass backdrop-blur-sm p-6 font-mono text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-flame-gradient tracking-tight">MCQ Quiz</h1>
          
          {!subject && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white tracking-tight">Choose a Subject</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subj) => (
                  <motion.div
                    key={subj}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      className={`border border-flamePurple/30 bg-glass backdrop-blur-sm h-auto p-4 flex items-center justify-between w-full ${
                        subject === subj ? 'border-flamePurple' : ''
                      }`}
                      variant="outline"
                      onClick={() => handleSubjectSelection(subj)}
                    >
                      <span className="text-white">{subj}</span>
                      <Brain className="h-5 w-5 ml-2 text-flamePurple-light" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {subject && !quizStarted && !quizCompleted && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-transparent bg-clip-text bg-flame-gradient tracking-tight">Ready to Start</h2>
              <p className="text-white/80">
                You have selected <span className="font-medium text-flamePurple-light">{subject}</span>. 
                This quiz will test your knowledge with AI-generated multiple-choice questions.
              </p>
              
              {/* Difficulty Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-white">Select Difficulty Level</Label>
                <RadioGroup 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" className="text-flamePurple border-flamePurple" />
                    <Label htmlFor="easy" className="text-white">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" className="text-flamePurple border-flamePurple" />
                    <Label htmlFor="medium" className="text-white">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" className="text-flamePurple border-flamePurple" />
                    <Label htmlFor="hard" className="text-white">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  className="bg-flamePurple hover:bg-flamePurple-light text-white rounded-none border border-flamePurple/20"
                  onClick={startQuiz}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {quizStarted && currentQuestion && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">{subject} Quiz</h2>
                <div className="text-sm font-medium">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </div>
              </div>
              
              <MCQQuestion 
                data={currentQuestion} 
                onAnswer={handleMCQAnswer}
                isAnswerSubmitted={isAnswerSubmitted}
              />
              
              {mistakeAnalysis && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h3 className="font-medium text-red-500 mb-2">Mistake Analysis</h3>
                  <p className="text-sm">{mistakeAnalysis}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-foreground/10">
                <div className="text-sm">
                  Score: {score.correct}/{score.total}
                </div>
                
                <div className="flex gap-2">
                  {isAnswerSubmitted && !saving && (
                    <Button
                      className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  )}
                  {saving && (
                    <Button disabled className="bg-thinkforge-purple/50">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Results...
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exitQuiz}
                    disabled={saving}
                  >
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {quizCompleted && quizAnalysis && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Quiz Results 🎯</h2>
                <div className="text-3xl font-bold text-thinkforge-purple mb-4">
                  {score.correct}/{questions.length} ({quizAnalysis.overallScore}%)
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                {quizAnalysis.strongAreas.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="font-medium text-green-500 mb-2 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Strong Areas
                    </h3>
                    <ul className="text-sm space-y-1">
                      {quizAnalysis.strongAreas.map((area: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {quizAnalysis.weakAreas.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h3 className="font-medium text-orange-500 mb-2 flex items-center">
                      <Target className="mr-2 h-4 w-4" />
                      Areas for Improvement
                    </h3>
                    <ul className="text-sm space-y-1">
                      {quizAnalysis.weakAreas.map((area: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Detailed Analysis */}
              <div className="bg-foreground/5 rounded-lg p-4">
                <h3 className="font-medium mb-2">Detailed Analysis</h3>
                <p className="text-sm leading-relaxed">{quizAnalysis.detailedAnalysis}</p>
              </div>

              {/* Recommendations */}
              {quizAnalysis.recommendations.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="font-medium text-blue-500 mb-2">Recommendations</h3>
                  <ul className="text-sm space-y-2">
                    {quizAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">💡</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSubject(null);
                    setQuizCompleted(false);
                  }}
                >
                  Try Different Subject
                </Button>
                <Button 
                  className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
                  onClick={() => {
                    setQuizCompleted(false);
                    startQuiz();
                  }}
                >
                  Retry {subject} Quiz
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/progress')}
                >
                  View Progress
                </Button>
              </div>
            </div>
          )}

          {!quizStarted && subject && score.total > 0 && !quizCompleted && (
            <div className="mt-6 p-4 rounded-lg bg-foreground/5">
              <h3 className="font-medium mb-2">Quiz Results</h3>
              <p>You scored {score.correct} out of {score.total}</p>
              <div className="mt-4 flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setSubject(null)}
                >
                  Try Different Subject
                </Button>
                <Button 
                  className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
                  onClick={startQuiz}
                >
                  Retry Quiz
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button
              variant="link"
              className="text-flamePurple hover:text-flamePurple-light"
              onClick={() => navigate('/chat')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Switch to 1:1 Learning Chat
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MCQQuiz;
