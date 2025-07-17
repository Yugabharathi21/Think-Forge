import { MCQQuestionData } from '@/features/chat/types';
import { chatService, quizService } from './database';

// Environment variable for Ollama URL - fallback to localhost for development
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_API_URL = `${OLLAMA_BASE_URL}/api/generate`;
const OLLAMA_TAGS_URL = `${OLLAMA_BASE_URL}/api/tags`;
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'mistral:7b';
const USE_MOCK_RESPONSES = import.meta.env.VITE_USE_MOCK_AI === 'true';

// Debug environment variables on load
console.log('🔧 Ollama Configuration:');
console.log('   VITE_OLLAMA_URL:', import.meta.env.VITE_OLLAMA_URL);
console.log('   OLLAMA_BASE_URL:', OLLAMA_BASE_URL);
console.log('   OLLAMA_API_URL:', OLLAMA_API_URL);
console.log('   OLLAMA_TAGS_URL:', OLLAMA_TAGS_URL);
console.log('   OLLAMA_MODEL:', OLLAMA_MODEL);
console.log('   USE_MOCK_RESPONSES:', USE_MOCK_RESPONSES);

interface OllamaResponse {
  response: string;
  done: boolean;
  model: string;
}

// Fallback question generator
function generateFallbackQuestions(
  subject: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): MCQQuestionData[] {
  const timestamp = Date.now();
  const questions: MCQQuestionData[] = [];
  
  // Subject-specific question templates
  const templates = {
    Mathematics: {
      easy: [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctOption: 1,
          explanation: "2 + 2 = 4. This is basic addition."
        },
        {
          question: "What is 5 × 3?",
          options: ["12", "15", "18", "20"],
          correctOption: 1,
          explanation: "5 × 3 = 15. This is basic multiplication."
        }
      ],
      medium: [
        {
          question: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2x²"],
          correctOption: 1,
          explanation: "The derivative of x² is 2x using the power rule."
        }
      ],
      hard: [
        {
          question: "What is the integral of sin(x)?",
          options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
          correctOption: 1,
          explanation: "The integral of sin(x) is -cos(x) + C."
        }
      ]
    },
    Physics: {
      easy: [
        {
          question: "What is the SI unit of force?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correctOption: 1,
          explanation: "The Newton (N) is the SI unit of force."
        }
      ],
      medium: [
        {
          question: "What is Newton's second law?",
          options: ["F = ma", "E = mc²", "P = mv", "W = Fd"],
          correctOption: 0,
          explanation: "Newton's second law states that Force equals mass times acceleration (F = ma)."
        }
      ],
      hard: [
        {
          question: "What is the speed of light in vacuum?",
          options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁷ m/s"],
          correctOption: 0,
          explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second."
        }
      ]
    },
    Chemistry: {
      easy: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H₂O", "CO₂", "NaCl", "O₂"],
          correctOption: 0,
          explanation: "Water is H₂O, consisting of two hydrogen atoms and one oxygen atom."
        }
      ],
      medium: [
        {
          question: "What is the atomic number of carbon?",
          options: ["4", "6", "8", "12"],
          correctOption: 1,
          explanation: "Carbon has an atomic number of 6, meaning it has 6 protons."
        }
      ],
      hard: [
        {
          question: "What is Avogadro's number?",
          options: ["6.022 × 10²³", "3.14 × 10⁸", "9.81 × 10²", "1.602 × 10⁻¹⁹"],
          correctOption: 0,
          explanation: "Avogadro's number is 6.022 × 10²³ particles per mole."
        }
      ]
    }
  };
  
  const subjectTemplates = templates[subject as keyof typeof templates];
  const difficultyTemplates = subjectTemplates?.[difficulty] || [
    {
      question: `Sample ${difficulty} question about ${subject}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOption: 0,
      explanation: "This is a sample question for demonstration purposes."
    }
  ];
  
  for (let i = 0; i < count; i++) {
    const template = difficultyTemplates[i % difficultyTemplates.length];
    questions.push({
      id: `fallback-${subject.toLowerCase().replace(' ', '_')}-${timestamp}-${i}`,
      question: template.question,
      options: template.options,
      correctOption: template.correctOption,
      explanation: template.explanation
    });
  }
  
  return questions;
}

// Enhanced chat service that integrates with Supabase
export async function generateChatResponse(
  sessionId: string | null,
  message: string, 
  subject: string,
  context?: string[]
): Promise<string> {
  // Add user message to database if session exists
  if (sessionId) {
    await chatService.addMessage(sessionId, message, 'user');
  }

  // Build context from previous messages
  let contextPrompt = '';
  if (context && context.length > 0) {
    contextPrompt = `Previous conversation context:\n${context.join('\n')}\n\n`;
  }

  const prompt = `${contextPrompt}You are ThinkForge, an AI learning assistant specializing in ${subject}. 
  Provide clear, educational responses that help students understand concepts better.
  
  Student question: ${message}
  
  Please provide a helpful, accurate response that:
  1. Directly addresses the question
  2. Uses simple language appropriate for learning
  3. Includes examples when helpful
  4. Encourages further learning
  
  Keep your response concise but informative (2-3 paragraphs maximum).
  
  Response:`;

  let response: string;

  if (USE_MOCK_RESPONSES || !await isOllamaAvailable()) {
    console.log('📋 Using mock response (Ollama unavailable or disabled)');
    response = generateMockResponse(message, subject);
  } else {
    try {
      console.log('🚀 Generating AI response for:', message.substring(0, 50) + '...');
      response = await callOllamaAPI(prompt);
      console.log('✅ AI response generated successfully');
    } catch (error) {
      console.error('❌ Ollama API error, falling back to mock response:', error);
      
      // Provide specific error feedback to user
      if (error instanceof Error && error.message.includes('timed out')) {
        response = `I'm sorry, but the AI is taking longer than expected to respond (request timed out). This might happen when the AI model is busy or your question is very complex.

Here's a basic response to help you with ${subject}: ${generateMockResponse(message, subject)}

💡 Tip: Try asking a more specific or shorter question, or try again in a few moments when the AI might be less busy.`;
      } else {
        response = `I'm experiencing some technical difficulties connecting to the AI service right now. Let me provide you with a helpful response about ${subject}:

${generateMockResponse(message, subject)}

🔧 The AI service should be back online shortly. Please try again in a few moments for more detailed responses.`;
      }
    }
  }

  // Add AI response to database if session exists
  if (sessionId) {
    await chatService.addMessage(sessionId, response, 'assistant');
  }

  return response;
}

async function isOllamaAvailable(): Promise<boolean> {
  try {
    console.log('🔄 Checking Ollama connection at:', OLLAMA_TAGS_URL);
    const response = await fetch(OLLAMA_TAGS_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    
    if (response.ok) {
      // Try to parse the response to make sure it's a valid Ollama API
      try {
        const data = await response.json();
        console.log('✅ Ollama service is running and responding correctly');
        console.log('🔧 Available models:', data.models?.length || 0);
        console.log('🔧 Ollama model configured:', OLLAMA_MODEL);
        console.log('🔧 Use mock responses:', USE_MOCK_RESPONSES);
        
        // Check if our configured model is available
        const modelExists = data.models?.some((model: { name: string }) => 
          model.name === OLLAMA_MODEL || model.name.startsWith(OLLAMA_MODEL.split(':')[0])
        );
        
        if (modelExists) {
          console.log('✅ Configured model found:', OLLAMA_MODEL);
        } else {
          console.log('⚠️ Configured model not found:', OLLAMA_MODEL);
          console.log('📋 Available models:', data.models?.map((m: { name: string }) => m.name));
        }
        
        return true;
      } catch (jsonError) {
        console.log('⚠️ Ollama is running but not responding with valid JSON');
        return false;
      }
    } else {
      console.log('❌ Ollama connection failed. Status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Ollama connection error:', error);
    return false;
  }
}

async function callOllamaAPI(prompt: string, retryCount: number = 0): Promise<string> {
  console.log('🤖 Sending request to Ollama API...');
  console.log('🔧 API URL:', OLLAMA_API_URL);
  console.log('🔧 Model:', OLLAMA_MODEL);
  console.log('� Retry attempt:', retryCount + 1);
  console.log('�📝 Prompt length:', prompt.length, 'characters');
  console.log('📝 Prompt preview:', prompt.substring(0, 200) + '...');
  
  const requestBody = {
    model: OLLAMA_MODEL,
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 800, // Increased token limit
      num_ctx: 4096,    // Context window
    },
  };

  console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
  
  // Create an AbortController for manual timeout control
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ Request timeout after 60 seconds');
    controller.abort();
  }, 60000); // 60 second timeout
  
  try {
    const startTime = Date.now();
    console.log('⏱️ Request started at:', new Date(startTime).toISOString());
    
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('📥 Response status:', response.status);
    console.log('⏱️ Request duration:', duration, 'ms');
    console.log('📥 Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Ollama API error. Status:', response.status);
      console.log('❌ Error response:', errorText);
      console.log('🔧 API URL used:', OLLAMA_API_URL);
      
      // Retry on certain errors
      if ((response.status === 500 || response.status === 503) && retryCount < 2) {
        console.log('🔄 Retrying due to server error...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        return callOllamaAPI(prompt, retryCount + 1);
      }
      
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data: OllamaResponse = await response.json();
    console.log('✅ Ollama response received. Length:', data.response.length, 'characters');
    console.log('📄 Response preview:', data.response.substring(0, 200) + '...');
    console.log('⏱️ Total processing time:', duration, 'ms');
    return data.response.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ Ollama API call failed:', error);
    
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
      
      // Retry on timeout errors
      if (error.name === 'AbortError' && retryCount < 2) {
        console.log('🔄 Retrying due to timeout...');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        return callOllamaAPI(prompt, retryCount + 1);
      }
      
      // If it's a timeout, provide a more specific error
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 60 seconds. The AI model might be busy or the prompt is too complex.');
      }
    }
    
    throw error;
  }
}

function generateMockResponse(message: string, subject: string): string {
  const lcMessage = message.toLowerCase();
  
  // Subject-specific responses
  if (subject === 'Mathematics') {
    if (lcMessage.includes('derivative') || lcMessage.includes('calculus')) {
      return "In calculus, a derivative measures how a function changes as its input changes. The derivative of f(x) = x² is f'(x) = 2x. This tells us that at any point x, the function is changing at a rate of 2x. For example, at x = 3, the rate of change is 6.";
    } else if (lcMessage.includes('integral')) {
      return "Integration is the reverse process of differentiation. The integral of f(x) = 2x is x² + C, where C is the constant of integration. Think of integration as finding the area under a curve.";
    } else if (lcMessage.includes('trigonometry') || lcMessage.includes('sin') || lcMessage.includes('cos')) {
      return "Trigonometry deals with triangles and circular functions. sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, and tan(θ) = opposite/adjacent. The unit circle helps visualize these relationships.";
    }
  } else if (subject === 'Physics') {
    if (lcMessage.includes('newton') || lcMessage.includes('force')) {
      return "Newton's laws describe motion: 1) Objects at rest stay at rest unless acted upon by a force. 2) F = ma (force equals mass times acceleration). 3) For every action, there's an equal and opposite reaction.";
    } else if (lcMessage.includes('energy')) {
      return "Energy comes in many forms: kinetic (motion), potential (position), thermal (heat), and more. The law of conservation of energy states that energy cannot be created or destroyed, only transformed.";
    }
  } else if (subject === 'Chemistry') {
    if (lcMessage.includes('atom') || lcMessage.includes('element')) {
      return "Atoms are the basic building blocks of matter, consisting of protons, neutrons, and electrons. Elements are pure substances made of only one type of atom, arranged in the periodic table.";
    }
  }

  return `That's a great question about ${subject}! Let me help you understand this concept better. Could you be more specific about what aspect you'd like me to explain? I'm here to make learning ${subject} easier and more engaging for you.`;
}

export async function generateQuizQuestions(
  subject: string, 
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  userId?: string
): Promise<MCQQuestionData[]> {
  console.log(`🎯 Generating ${count} ${difficulty} MCQ questions for ${subject}...`);
  
  const prompt = `You are an educational AI assistant. Generate exactly ${count} multiple choice questions about ${subject} at ${difficulty} difficulty level.

REQUIREMENTS:
- Return ONLY a valid JSON array
- Each question must have exactly 4 options
- Questions should test different concepts within ${subject}
- Include clear explanations for correct answers
- Use proper academic terminology

RESPONSE FORMAT (JSON only):
[
  {
    "id": "${subject.toLowerCase().replace(' ', '_')}_q1_${Date.now()}",
    "question": "Your educational question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 0,
    "explanation": "Why this answer is correct"
  }
]

Subject: ${subject}
Difficulty: ${difficulty}
Question Count: ${count}

JSON Response:`;

  const isOllamaConnected = await isOllamaAvailable();
  
  if (USE_MOCK_RESPONSES || !isOllamaConnected) {
    console.log('📋 Using fallback sample questions for', subject);
    // Return sample questions from constants as fallback
    const fallbackQuestions = generateFallbackQuestions(subject, difficulty, count);
    
    // Store quiz session if user is provided
    if (userId && fallbackQuestions.length > 0) {
      try {
        console.log('💾 Note: Quiz session will be stored when quiz is completed...');
        // Will be stored when quiz is submitted with results
      } catch (dbError) {
        console.error('❌ Failed to store quiz session:', dbError);
      }
    }
    
    return fallbackQuestions;
  }

  try {
    console.log('🤖 Requesting questions from Ollama...');
    const response = await callOllamaAPI(prompt);
    
    // Clean and parse the response
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Extract JSON array if it's embedded in text
    const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    console.log('📝 Parsing Ollama response...');
    const questions = JSON.parse(cleanResponse);
    
    // Validate and ensure proper structure
    const validQuestions = questions.filter((q: unknown) => {
      const question = q as Record<string, unknown>;
      const isValid = question.id && question.question && question.options && 
             Array.isArray(question.options) && question.options.length === 4 && 
             typeof question.correctOption === 'number' && question.explanation;
      
      if (!isValid) {
        console.warn('⚠️ Invalid question structure:', question);
      }
      return isValid;
    }) as MCQQuestionData[];
    
    // If we don't have enough valid questions, supplement with fallback
    if (validQuestions.length < count) {
      const needed = count - validQuestions.length;
      console.log(`⚠️ Only got ${validQuestions.length} valid questions, adding ${needed} fallback questions`);
      const fallbackQuestions = generateFallbackQuestions(subject, difficulty, needed);
      validQuestions.push(...fallbackQuestions);
    }
    
    // Ensure we have exactly the requested count
    const finalQuestions = validQuestions.slice(0, count);
    
    // Store quiz session if user is provided
    if (userId && finalQuestions.length > 0) {
      try {
        console.log('💾 Note: AI-generated quiz session will be stored when quiz is completed...');
        // Will be stored when quiz is submitted with results
      } catch (dbError) {
        console.error('❌ Failed to store quiz session:', dbError);
      }
    }
    
    console.log(`✅ Generated ${finalQuestions.length} valid questions from Ollama`);
    return finalQuestions;
  } catch (error) {
    console.error('❌ Error generating questions with Ollama:', error);
    
    // Provide more specific error handling
    if (error instanceof Error && error.message.includes('timed out')) {
      console.log('⏰ Quiz generation timed out, using fallback questions');
    } else {
      console.log('🔧 Quiz generation failed, using fallback questions');
    }
    
    // Fallback to sample questions
    console.log('📋 Falling back to sample questions for', subject);
    const fallbackQuestions = generateFallbackQuestions(subject, difficulty, count);
    
    // Store fallback quiz session if user is provided
    if (userId && fallbackQuestions.length > 0) {
      try {
        console.log('💾 Note: Fallback quiz session will be stored when quiz is completed...');
        // Will be stored when quiz is submitted with results
      } catch (dbError) {
        console.error('❌ Failed to store quiz session:', dbError);
      }
    }
    
    return fallbackQuestions;
  }
}

// Enhanced quiz analysis with weakness detection
export async function analyzeQuizPerformance(
  subject: string,
  questions: MCQQuestionData[],
  userAnswers: number[],
  userId?: string
): Promise<{
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  detailedAnalysis: string;
}> {
  console.log(`📊 Analyzing quiz performance for ${subject}...`);
  
  const correctAnswers = questions.map(q => q.correctOption);
  const correctCount = userAnswers.reduce((count, answer, index) => 
    answer === correctAnswers[index] ? count + 1 : count, 0);
  
  const overallScore = Math.round((correctCount / questions.length) * 100);
  
  // Identify incorrect answers for weakness analysis
  const incorrectQuestions = questions.filter((_, index) => 
    userAnswers[index] !== correctAnswers[index]);
  
  const prompt = `Analyze this quiz performance for ${subject}:

QUIZ RESULTS:
- Total Questions: ${questions.length}
- Correct Answers: ${correctCount}
- Score: ${overallScore}%

INCORRECT QUESTIONS:
${incorrectQuestions.map((q, i) => `
Question: ${q.question}
User Answer: ${q.options[userAnswers[questions.indexOf(q)]]}
Correct Answer: ${q.options[q.correctOption]}
`).join('\n')}

Please provide a detailed analysis in JSON format:
{
  "weakAreas": ["specific topic 1", "specific topic 2"],
  "strongAreas": ["topic where student did well"],
  "recommendations": ["specific study suggestion 1", "specific study suggestion 2"],
  "detailedAnalysis": "Comprehensive paragraph explaining strengths, weaknesses, and next steps"
}

Focus on identifying specific mathematical/scientific concepts, not just general study advice.`;

  const isOllamaConnected = await isOllamaAvailable();
  
  if (USE_MOCK_RESPONSES || !isOllamaConnected) {
    console.log('📋 Using basic analysis (Ollama unavailable)');
    return generateBasicAnalysis(subject, overallScore, incorrectQuestions);
  }

  try {
    console.log('🤖 Requesting detailed analysis from Ollama...');
    const response = await callOllamaAPI(prompt);
    
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    
    const analysis = JSON.parse(cleanResponse);
    console.log('✅ Analysis completed by Ollama');
    
    return {
      overallScore,
      weakAreas: analysis.weakAreas || [],
      strongAreas: analysis.strongAreas || [],
      recommendations: analysis.recommendations || [],
      detailedAnalysis: analysis.detailedAnalysis || 'Analysis completed successfully.'
    };
  } catch (error) {
    console.error('❌ Error generating analysis with Ollama:', error);
    return generateBasicAnalysis(subject, overallScore, incorrectQuestions);
  }
}

function generateBasicAnalysis(
  subject: string, 
  score: number, 
  incorrectQuestions: MCQQuestionData[]
): {
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  detailedAnalysis: string;
} {
  const weakAreas = incorrectQuestions.length > 0 
    ? [`${subject} fundamentals`, 'Problem-solving techniques']
    : [];
    
  const strongAreas = score >= 70 
    ? [`Basic ${subject} concepts`]
    : [];
    
  const recommendations = [
    `Review the ${incorrectQuestions.length} questions you got wrong`,
    `Practice more ${subject} problems`,
    'Focus on understanding the explanations provided'
  ];
  
  const detailedAnalysis = score >= 80
    ? `Excellent performance in ${subject}! You've demonstrated strong understanding of the concepts.`
    : score >= 60
    ? `Good effort in ${subject}. Focus on the areas where you made mistakes to improve further.`
    : `There's room for improvement in ${subject}. Review the fundamental concepts and practice more questions.`;
    
  return {
    overallScore: score,
    weakAreas,
    strongAreas,
    recommendations,
    detailedAnalysis
  };
}

export async function analyzeMistake(
  question: MCQQuestionData, 
  selectedOption: number,
  userId?: string
): Promise<string> {
  console.log('🔍 Analyzing mistake for question:', question.id);
  
  const prompt = `Analyze why this answer is incorrect and provide educational feedback:
  
  Question: ${question.question}
  Selected Answer: ${question.options[selectedOption]}
  Correct Answer: ${question.options[question.correctOption]}
  Explanation: ${question.explanation}
  
  Provide a detailed, educational analysis that:
  1. Explains why the selected answer is wrong
  2. Clarifies the correct concept
  3. Gives tips to avoid this mistake in the future
  4. Uses encouraging, supportive language
  
  Keep the response focused and helpful for learning.`;

  if (USE_MOCK_RESPONSES || !await isOllamaAvailable()) {
    console.log('📋 Using basic mistake analysis');
    return `The correct answer is "${question.options[question.correctOption]}". ${question.explanation || 'Let me explain why this is correct...'} 

Common mistake: Many students choose "${question.options[selectedOption]}" because it might seem related to the topic. However, the key is to understand the specific concept being tested.

💡 Tip: Review the fundamental concepts of this topic and practice similar questions to strengthen your understanding.`;
  }

  try {
    console.log('🤖 Requesting mistake analysis from Ollama...');
    const analysis = await callOllamaAPI(prompt);
    console.log('✅ Mistake analysis completed');
    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing mistake with Ollama:', error);
    return `The correct answer is "${question.options[question.correctOption]}". ${question.explanation || ''} 

I'd recommend reviewing this topic and practicing more questions to improve your understanding.`;
  }
} 