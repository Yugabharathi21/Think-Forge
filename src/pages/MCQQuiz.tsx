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
import { BookOpen, ArrowRight, Brain, Loader2 } from 'lucide-react';
import { generateQuizQuestions, analyzeMistake } from '@/lib/ollama';
import { MCQQuestionData } from '@/features/chat/types';

const MCQQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [subject, setSubject] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questions, setQuestions] = useState<MCQQuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      subject: '',
    },
  });

  const currentQuestion = questions[currentQuestionIdx];

  const handleSubjectSelection = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setQuestions([]);
    setCurrentQuestionIdx(0);
    setQuizStarted(false);
    setScore({ correct: 0, total: 0 });
    setMistakeAnalysis(null);
    setIsAnswerSubmitted(false);
  };

  const startQuiz = async () => {
    if (!subject) return;
    
    setLoading(true);
    try {
      const generatedQuestions = await generateQuizQuestions(subject, 5);
      setQuestions(generatedQuestions);
      setQuizStarted(true);
      setCurrentQuestionIdx(0);
      setScore({ correct: 0, total: 0 });
      setMistakeAnalysis(null);
      setIsAnswerSubmitted(false);
    } catch (error) {
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
    
    setIsAnswerSubmitted(true);
    
    // Update score
    setScore(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    // Show toast notification
    if (wasCorrect) {
      toast({
        title: "Correct!",
        description: "Well done on getting that right!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "That's not the right answer, but keep trying!",
        duration: 3000,
      });

      // Analyze the mistake
      try {
        const analysis = await analyzeMistake(currentQuestion, selectedOptionIndex);
        setMistakeAnalysis(analysis);
      } catch (error) {
        console.error('Error analyzing mistake:', error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setMistakeAnalysis(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      toast({
        title: "Quiz Completed!",
        description: `Your final score: ${score.correct}/${score.total}`,
        duration: 5000,
      });
      setQuizStarted(false);
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

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="glass-card p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">MCQ Quiz</h1>
          
          {!subject && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Choose a Subject</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subj) => (
                  <Button
                    key={subj}
                    className={`glass-card h-auto p-4 flex items-center justify-between ${
                      subject === subj ? 'neon-border-light' : ''
                    }`}
                    variant="outline"
                    onClick={() => handleSubjectSelection(subj)}
                  >
                    <span>{subj}</span>
                    <Brain className="h-5 w-5 ml-2" />
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {subject && !quizStarted && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Ready to Start</h2>
              <p className="text-foreground/80">
                You have selected <span className="font-medium">{subject}</span>. 
                This quiz will test your knowledge with AI-generated multiple-choice questions.
              </p>
              
              <div className="flex justify-center mt-6">
                <Button 
                  className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
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
                      Start Quiz
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
                  {isAnswerSubmitted && (
                    <Button
                      className="bg-thinkforge-purple hover:bg-thinkforge-purple/90"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exitQuiz}
                  >
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!quizStarted && subject && score.total > 0 && (
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
              onClick={() => navigate('/chat')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Switch to 1:1 Learning Chat
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MCQQuiz;
