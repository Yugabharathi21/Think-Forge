
import { Brain, BookOpen } from 'lucide-react';
import { LearningMode, MCQQuestionData } from './types';

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Geography',
  'Literature',
  'Economics'
];

// Comprehensive subtopics for each subject
export const subjectSubtopics: Record<string, string[]> = {
  'Mathematics': [
    'Algebra',
    'Calculus',
    'Geometry',
    'Trigonometry',
    'Statistics',
    'Linear Algebra',
    'Number Theory',
    'Probability',
    'Differential Equations',
    'Discrete Mathematics',
    'Functions',
    'Equations',
    'Inequalities',
    'Matrices',
    'Vectors',
    'Complex Numbers',
    'Sequences',
    'Series',
    'Integration',
    'Differentiation'
  ],
  'Physics': [
    'Mechanics',
    'Thermodynamics',
    'Electromagnetism',
    'Optics',
    'Quantum Physics',
    'Nuclear Physics',
    'Astrophysics',
    'Fluid Dynamics',
    'Wave Physics',
    'Relativity'
  ],
  'Chemistry': [
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Physical Chemistry',
    'Analytical Chemistry',
    'Biochemistry',
    'Electrochemistry',
    'Thermochemistry',
    'Chemical Kinetics',
    'Atomic Structure',
    'Chemical Bonding'
  ],
  'Biology': [
    'Cell Biology',
    'Genetics',
    'Ecology',
    'Evolution',
    'Anatomy',
    'Physiology',
    'Microbiology',
    'Biochemistry',
    'Molecular Biology',
    'Botany'
  ],
  'Computer Science': [
    'Data Structures',
    'Algorithms',
    'Programming Languages',
    'Database Systems',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Cybersecurity',
    'Computer Architecture',
    'Arrays',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Hash Tables',
    'Sorting Algorithms',
    'Search Algorithms',
    'Dynamic Programming'
  ],
  'History': [
    'Ancient History',
    'Medieval History',
    'Modern History',
    'World War I',
    'World War II',
    'American History',
    'European History',
    'Asian History',
    'African History',
    'Industrial Revolution'
  ],
  'Geography': [
    'Physical Geography',
    'Human Geography',
    'Economic Geography',
    'Political Geography',
    'Climatology',
    'Oceanography',
    'Geomorphology',
    'Cartography',
    'Environmental Geography',
    'Urban Geography'
  ],
  'Literature': [
    'Poetry',
    'Prose',
    'Drama',
    'Novels',
    'Short Stories',
    'Classical Literature',
    'Modern Literature',
    'World Literature',
    'Literary Criticism',
    'Creative Writing'
  ],
  'Economics': [
    'Microeconomics',
    'Macroeconomics',
    'International Economics',
    'Development Economics',
    'Labor Economics',
    'Public Economics',
    'Financial Economics',
    'Behavioral Economics',
    'Game Theory',
    'Econometrics'
  ]
};

export const learningModes: LearningMode[] = [
  {
    id: 'mcq',
    name: 'MCQ Practice',
    description: 'Test your knowledge with multiple-choice questions',
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: 'chat',
    name: '1:1 Learning Session',
    description: 'Have a conversation with AI to deepen your understanding',
    icon: <BookOpen className="h-5 w-5" />
  }
];

// Sample MCQ questions for demo
export const sampleMCQs: Record<string, MCQQuestionData[]> = {
  'Mathematics': [
    {
      id: 'math-1',
      question: 'If f(x) = 2x² + 3x - 5, what is f\'(x)?',
      options: ['4x + 3', '2x + 3', '4x - 5', '2x² + 3'],
      correctOption: 0,
      explanation: 'The derivative of f(x) = 2x² + 3x - 5 is calculated using the power rule and the derivative of a sum rule. For the term 2x², the derivative is 2 × 2 × x¹ = 4x. For 3x, it\'s 3, and for -5, it\'s 0. So f\'(x) = 4x + 3.'
    },
    {
      id: 'math-2',
      question: 'What is the area of a circle with radius 5 units?',
      options: ['25π square units', '10π square units', '5π square units', '15π square units'],
      correctOption: 0,
      explanation: 'The area of a circle is calculated using the formula A = πr². With r = 5, we get A = π × 5² = 25π square units.'
    },
    {
      id: 'math-3',
      question: 'Solve for x: 3x - 7 = 20',
      options: ['9', '7', '8', '10'],
      correctOption: 0,
      explanation: 'To solve 3x - 7 = 20, first add 7 to both sides: 3x = 27. Then divide by 3: x = 9.'
    }
  ],
  'Physics': [
    {
      id: 'phys-1',
      question: 'What is the SI unit of force?',
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctOption: 0,
      explanation: 'The SI unit of force is the Newton (N), which is defined as the force needed to accelerate a mass of one kilogram by one meter per second squared.'
    },
    {
      id: 'phys-2',
      question: 'Which of the following is a vector quantity?',
      options: ['Velocity', 'Temperature', 'Mass', 'Energy'],
      correctOption: 0,
      explanation: 'Velocity is a vector quantity because it has both magnitude (speed) and direction. Temperature, mass, and energy are scalar quantities.'
    }
  ],
  'Computer Science': [
    {
      id: 'cs-1',
      question: 'What does CPU stand for?',
      options: ['Central Processing Unit', 'Control Processing Unit', 'Computer Processing Unit', 'Central Program Unit'],
      correctOption: 0,
      explanation: 'CPU stands for Central Processing Unit. It is the primary component of a computer that performs most of the processing inside the computer.'
    },
    {
      id: 'cs-2',
      question: 'Which of the following is NOT a programming language?',
      options: ['HTML', 'Java', 'Python', 'C++'],
      correctOption: 0,
      explanation: 'HTML (Hypertext Markup Language) is not a programming language but a markup language used to structure content on web pages.'
    }
  ]
};
