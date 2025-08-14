import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button as ButtonUI } from '@/components/ui/button'; // Renamed to avoid conflicts
import MCQQuestion from '@/components/chat/MCQQuestion';
import AntiCheatSystem from '@/components/proctoring/AntiCheatSystem';
import { subjects } from '@/features/chat/constants';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { BookOpen, ArrowRight, Brain, Loader2, Target, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { generateQuizQuestions, analyzeMistake, analyzeQuizPerformance } from '@/lib/ollama';
import { quizService, testDatabaseConnection } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { MCQQuestionData } from '@/features/chat/types';
import { ViolationType, AntiCheatReport, generateAntiCheatReport } from '@/components/proctoring/types';
import { motion } from 'framer-motion';
// Material UI imports
import { Box, Typography, Button, useTheme, Radio, RadioGroup as MUIRadioGroup, FormControlLabel, FormControl as MUIFormControl, FormLabel, Paper } from '@mui/material';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
// Add Recharts imports at the top
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { UserProgress } from '@/lib/supabase';

const MCQQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const theme = useTheme();
  const { mode } = useAppTheme();
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
  const [progressData, setProgressData] = useState<UserProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Anti-cheat system states
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true);
  const [proctoringSystemReady, setProctoringSystemReady] = useState(false);
  const [violations, setViolations] = useState<ViolationType[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [showAntiCheatSetup, setShowAntiCheatSetup] = useState(false);

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

  // Anti-cheat handlers
  const handleViolation = (violation: ViolationType, severity: 'low' | 'medium' | 'high') => {
    setViolations(prev => [...prev, violation]);
    
    // Handle severe violations
    if (severity === 'high' && violations.filter(v => v.severity === 'high').length >= 3) {
      toast({
        title: "Quiz Terminated",
        description: "Too many security violations detected. Quiz has been terminated.",
        variant: "destructive",
      });
      exitQuiz();
    }
  };

  const handleProctoringSystemReady = (ready: boolean) => {
    setProctoringSystemReady(ready);
  };

  const generateAntiCheatReportForQuiz = (): AntiCheatReport => {
    return generateAntiCheatReport(violations, sessionStartTime, proctoringSystemReady, violations.filter(v => v.type === 'tab_switch').length);
  };

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
    
    // Check proctoring system readiness if anti-cheat is enabled
    if (antiCheatEnabled && !proctoringSystemReady) {
      setShowAntiCheatSetup(true);
      toast({
        title: "Proctoring System Required",
        description: "Please set up the proctoring system before starting the quiz.",
        variant: "destructive",
      });
      return;
    }
    
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
      setViolations([]);
      
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
      const antiCheatReport = antiCheatEnabled ? generateAntiCheatReportForQuiz() : null;
      
      await quizService.saveQuizResult(
        user.id,
        subject,
        questions.length,
        score.correct,
        questions,
        userAnswers,
        difficulty,
        antiCheatReport
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
    setViolations([]);
    setShowAntiCheatSetup(false);
  };

  useEffect(() => {
    // Set background based on theme mode
    document.body.style.background = mode === 'dark' ? '#0a0a0a' : '#f5f5f5';
    return () => {
      document.body.style.background = '';
    };
  }, [mode]);

  // Fetch persistent progress data when quiz is completed and user is available
  useEffect(() => {
    if (quizCompleted && user) {
      setProgressLoading(true);
      quizService.getUserProgress(user.id)
        .then((data) => setProgressData(data))
        .finally(() => setProgressLoading(false));
    }
  }, [quizCompleted, user]);
  
  return (
    <Layout>
      <Box 
        sx={{ 
          maxWidth: '1200px',
          mx: 'auto',
          py: 4,
          px: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background effects */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -80,
            left: -160,
            width: '500px',
            height: '500px',
            background: 'linear-gradient(90deg, #861aff 0%, #ff8a00 100%)',
            filter: 'blur(120px)',
            opacity: '0.2',
            transform: 'rotate(12deg)',
            zIndex: -1
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            top: 160,
            right: -160,
            width: '600px',
            height: '600px',
            background: 'linear-gradient(90deg, #861aff 0%, #ff8a00 100%)',
            filter: 'blur(120px)',
            opacity: '0.1',
            transform: 'rotate(-12deg)',
            zIndex: -1
          }}
        />
        
        <motion.div 
          style={{
            border: `1px solid ${theme.palette.primary.main}40`,
            borderRadius: theme.shape.borderRadius * 2,
            padding: theme.spacing(3),
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.7)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #861aff 0%, #ff8a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}
          >
            MCQ Quiz
          </Typography>
          
          {/* Anti-Cheat System Setup */}
          {(antiCheatEnabled && (showAntiCheatSetup || !subject)) && (
            <Box sx={{ mb: 4 }}>
              <Paper 
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Shield className="mr-2 text-blue-600" style={{ fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={500}>
                    Proctoring System Setup
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This quiz uses an anti-cheat system to ensure integrity. Please set up the proctoring system before starting.
                </Typography>
                
                <AntiCheatSystem
                  onViolation={handleViolation}
                  onSystemReady={handleProctoringSystemReady}
                  isQuizActive={quizStarted}
                  strictMode={true}
                />
                
                {proctoringSystemReady && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Shield className="mr-1" style={{ fontSize: 16 }} />
                      Proctoring system is ready. You can now start the quiz.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          {!subject && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary' }}>
                Choose a Subject
              </Typography>
              
              {/* Anti-cheat toggle */}
              <Box sx={{ 
                p: 2, 
                bgcolor: mode === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(245, 245, 245, 0.8)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Shield className="mr-2 text-blue-600" style={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Enable Proctoring System
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Camera monitoring and anti-cheat features
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant={antiCheatEnabled ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setAntiCheatEnabled(!antiCheatEnabled)}
                  sx={{ textTransform: 'none' }}
                >
                  {antiCheatEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 2
                }}
              >
                {subjects.map((subj) => (
                  <motion.div
                    key={subj}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%' }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSubjectSelection(subj)}
                      sx={{
                        p: 2,
                        height: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        borderColor: subject === subj ? 'primary.main' : 'divider',
                        borderWidth: subject === subj ? 2 : 1,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(40,40,40,0.7)' : 'rgba(245,245,245,0.9)',
                          boxShadow: theme => `0 0 8px ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{subj}</Typography>
                      <Brain className="ml-1 text-primary" style={{ fontSize: 20 }} />
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}
          
          {subject && !quizStarted && !quizCompleted && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 500,
                  background: 'linear-gradient(90deg, #861aff 0%, #ff8a00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                Ready to Start
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                You have selected <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>{subject}</Box>. 
                This quiz will test your knowledge with AI-generated multiple-choice questions.
              </Typography>
              
              {/* Difficulty Selection */}
              <MUIFormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
                <FormLabel component="legend" sx={{ 
                  color: 'text.primary', 
                  fontWeight: 500,
                  mb: 1 
                }}>
                  Select Difficulty Level
                </FormLabel>
                <MUIRadioGroup
                  row
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                >
                  <FormControlLabel 
                    value="easy" 
                    control={<Radio color="primary" />} 
                    label="Easy" 
                    sx={{ color: 'text.primary' }}
                  />
                  <FormControlLabel 
                    value="medium" 
                    control={<Radio color="primary" />} 
                    label="Medium" 
                    sx={{ color: 'text.primary' }}
                  />
                  <FormControlLabel 
                    value="hard" 
                    control={<Radio color="primary" />} 
                    label="Hard" 
                    sx={{ color: 'text.primary' }}
                  />
                </MUIRadioGroup>
              </MUIFormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={startQuiz}
                  disabled={loading}
                  sx={{
                    py: 1,
                    px: 3,
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: theme => `0 0 8px ${theme.palette.primary.main}80`
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 animate-spin" style={{ fontSize: 18 }} />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz
                      <ArrowRight className="ml-1" style={{ fontSize: 18 }} />
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          )}
          
          {quizStarted && currentQuestion && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography variant="h6" fontWeight={500} color="text.primary">{subject} Quiz</Typography>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </Typography>
              </Box>
              
              <MCQQuestion 
                data={currentQuestion} 
                onAnswer={handleMCQAnswer}
                isAnswerSubmitted={isAnswerSubmitted}
              />
              
              {mistakeAnalysis && (
                <Paper 
                  elevation={0}
                  sx={{
                    mt: 1, 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.15)'
                  }}
                >
                  <Typography variant="subtitle2" color="error" mb={0.5}>Mistake Analysis</Typography>
                  <Typography variant="body2">{mistakeAnalysis}</Typography>
                </Paper>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }}>
                <Typography variant="body2" fontWeight={500} color="text.primary">
                  Score: {score.correct}/{score.total}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isAnswerSubmitted && !saving && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNextQuestion}
                      sx={{
                        textTransform: 'none',
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        }
                      }}
                    >
                      {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  )}
                  {saving && (
                    <Button 
                      disabled 
                      variant="contained"
                      sx={{
                        bgcolor: `${theme.palette.primary.main}80`,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      <Loader2 className="mr-1 animate-spin" style={{ fontSize: 16 }} />
                      Saving Results...
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={exitQuiz}
                    disabled={saving}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderColor: theme.palette.mode === 'dark' ? 'divider' : theme.palette.primary.main,
                      color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.main,
                    }}
                  >
                    Exit Quiz
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          
          {quizCompleted && quizAnalysis && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" mb={1} color="text.primary">
                  Quiz Results 🎯
                </Typography>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color="primary.main" 
                  mb={2}
                >
                  {score.correct}/{questions.length} ({quizAnalysis.overallScore}%)
                </Typography>
              </Box>

              {/* Bar Chart */}
              {progressLoading ? (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mb: 4, textAlign: 'center' }}>
                  <Typography variant="body2">Loading progress chart...</Typography>
                </Box>
              ) : progressData.length > 0 ? (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mb: 4 }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={progressData.filter(p => p.subject === subject).map(p => ({
                        name: p.subject,
                        Correct: p.correct_answers,
                        Incorrect: p.total_questions_answered - p.correct_answers
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Bar dataKey="Correct" fill="#4caf50" />
                      <Bar dataKey="Incorrect" fill="#f44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mb: 4, textAlign: 'center' }}>
                  <Typography variant="body2">No progress data available yet.</Typography>
                </Box>
              )}

              {/* Performance Analysis */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3
              }}>
                {/* Strengths */}
                {quizAnalysis.strongAreas.length > 0 && (
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: mode === 'dark' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(46, 125, 50, 0.05)',
                      border: '1px solid',
                      borderColor: mode === 'dark' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.15)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp className="mr-1 text-green-600" style={{ fontSize: 18 }} />
                      <Typography variant="subtitle2" color="success.main">
                        Strong Areas
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {quizAnalysis.strongAreas.map((area: string, index: number) => (
                        <Box 
                          component="li" 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            mb: 0.5,
                            fontSize: '0.875rem'
                          }}
                        >
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>•</Box>
                          {area}
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* Weaknesses */}
                {quizAnalysis.weakAreas.length > 0 && (
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: mode === 'dark' ? 'rgba(237, 108, 2, 0.1)' : 'rgba(237, 108, 2, 0.05)',
                      border: '1px solid',
                      borderColor: mode === 'dark' ? 'rgba(237, 108, 2, 0.2)' : 'rgba(237, 108, 2, 0.15)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Target className="mr-1 text-yellow-600" style={{ fontSize: 18 }} />
                      <Typography variant="subtitle2" color="warning.main">
                        Areas for Improvement
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {quizAnalysis.weakAreas.map((area: string, index: number) => (
                        <Box 
                          component="li" 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            mb: 0.5,
                            fontSize: '0.875rem'
                          }}
                        >
                          <Box component="span" sx={{ color: 'warning.main', mr: 1 }}>•</Box>
                          {area.toLowerCase().includes(subject?.toLowerCase() || '') ? area : `${subject}: ${area}`}
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>

              {/* Detailed Analysis */}
              <Paper 
                elevation={0}
                sx={{
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: mode === 'dark' ? 'rgba(50, 50, 50, 0.5)' : 'rgba(240, 240, 240, 0.7)',
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'divider' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="subtitle2" fontWeight={500} mb={1}>Detailed Analysis</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  {quizAnalysis.detailedAnalysis}
                </Typography>
              </Paper>

              {/* Recommendations */}
              {quizAnalysis.recommendations.length > 0 && (
                <Paper 
                  elevation={0}
                  sx={{
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.15)'
                  }}
                >
                  <Typography variant="subtitle2" color="primary" mb={1}>Recommendations</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {quizAnalysis.recommendations.map((rec: string, index: number) => (
                      <Box 
                        component="li" 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          mb: 0.75,
                          fontSize: '0.875rem'
                        }}
                      >
                        <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>💡</Box>
                        {rec}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Anti-Cheat Report */}
              {antiCheatEnabled && violations.length > 0 && (
                <Paper 
                  elevation={0}
                  sx={{
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.15)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AlertTriangle className="mr-1 text-red-600" style={{ fontSize: 18 }} />
                    <Typography variant="subtitle2" color="error">
                      Security Report
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {violations.length} violation(s) detected during the quiz.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Risk Score: {generateAntiCheatReportForQuiz().riskScore}/100
                  </Typography>
                </Paper>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSubject(null);
                    setQuizCompleted(false);
                  }}
                  sx={{
                    textTransform: 'none',
                    borderColor: theme.palette.mode === 'dark' ? 'divider' : theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.main,
                  }}
                >
                  Try Different Subject
                </Button>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setQuizCompleted(false);
                    startQuiz();
                  }}
                  sx={{
                    textTransform: 'none',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Retry {subject} Quiz
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/progress')}
                  sx={{
                    textTransform: 'none',
                    borderColor: theme.palette.mode === 'dark' ? 'divider' : theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.main,
                  }}
                >
                  View Progress
                </Button>
              </Box>
            </Box>
          )}

          {!quizStarted && subject && score.total > 0 && !quizCompleted && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: mode === 'dark' ? 'rgba(50, 50, 50, 0.5)' : 'rgba(240, 240, 240, 0.7)',
                border: '1px solid',
                borderColor: mode === 'dark' ? 'divider' : 'rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="subtitle1" fontWeight={500} mb={1}>Quiz Results</Typography>
              <Typography variant="body1">
                You scored {score.correct} out of {score.total}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  color="primary"
                  onClick={() => setSubject(null)}
                  sx={{
                    textTransform: 'none',
                    borderColor: theme.palette.mode === 'dark' ? 'divider' : theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : theme.palette.primary.main,
                  }}
                >
                  Try Different Subject
                </Button>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={startQuiz}
                  sx={{
                    textTransform: 'none',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Retry Quiz
                </Button>
              </Box>
            </Paper>
          )}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/chat')}
              startIcon={<BookOpen style={{ fontSize: 18 }} />}
              sx={{
                textTransform: 'none',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.dark,
                  textDecoration: 'underline'
                }
              }}
            >
              Switch to 1:1 Learning Chat
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Layout>
  );
};

export default MCQQuiz;
