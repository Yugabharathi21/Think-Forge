import { MCQQuestionData } from '@/features/chat/types';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export async function generateQuizQuestions(subject: string, count: number = 5): Promise<MCQQuestionData[]> {
  const prompt = `Generate ${count} multiple choice questions about ${subject}. 
  Format each question as a JSON object with the following structure:
  {
    "id": "unique-id",
    "question": "the question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correctOption": 0,
    "explanation": "explanation of the correct answer"
  }
  Return the questions as a JSON array.`;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    const questions = JSON.parse(data.response);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function analyzeMistake(question: MCQQuestionData, selectedOption: number): Promise<string> {
  const prompt = `Analyze why the answer to this question is incorrect:
  Question: ${question.question}
  Selected Answer: ${question.options[selectedOption]}
  Correct Answer: ${question.options[question.correctOption]}
  Explanation: ${question.explanation}
  
  Provide a detailed explanation of why the selected answer is wrong and how to avoid this mistake in the future.`;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze mistake');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error analyzing mistake:', error);
    throw error;
  }
} 