// Core data types for Quizzer

export interface QuizOption {
  id: string; // 'a' | 'b' | 'c' | 'd'
  text: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string | string[]; // single letter or array for multi-answer
  isMultiAnswer: boolean;
}

export interface QuizModule {
  id: string;
  name: string;
  questions: Question[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // Tailwind gradient class
  modules: QuizModule[];
}

// Shuffled version of a question for the quiz engine
export interface ShuffledQuestion {
  id: string;
  question: string;
  originalOptions: QuizOption[]; // original, unshuffled
  shuffledOptions: QuizOption[]; // shuffled for display
  correctAnswer: string | string[]; // letter(s) in original option space
  shuffledCorrectAnswer: string | string[]; // letter(s) mapped to shuffled positions
  isMultiAnswer: boolean;
}

export type QuestionCountOption = 10 | 15 | 20 | 25 | 'all';

export interface QuizConfig {
  studentName: string;
  categoryId: string;
  categoryName: string;
  moduleId: string; // 'all' or specific module id
  moduleName: string;
  questionCount: QuestionCountOption;
  totalAvailableQuestions: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | string[] | null;
  isCorrect: boolean;
  correctAnswer: string | string[];
  shuffledCorrectAnswer: string | string[];
}

export interface QuizSession {
  config: QuizConfig;
  questions: ShuffledQuestion[];
  answers: QuizAnswer[];
  currentIndex: number;
  score: number;
  isCompleted: boolean;
  showAnswer: boolean;
  startedAt: number;
  completedAt?: number;
}

export interface QuizResult {
  studentName: string;
  categoryName: string;
  moduleName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'alrdot',
  password: '601364',
};

export const QUESTION_COUNT_OPTIONS: QuestionCountOption[] = [10, 15, 20, 25, 'all'];

export const PASS_PERCENTAGE = 50;
