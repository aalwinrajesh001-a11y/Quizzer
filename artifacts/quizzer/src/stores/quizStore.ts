import { create } from 'zustand';
import {
  QuizSession,
  QuizConfig,
  ShuffledQuestion,
  QuizAnswer,
  QuizResult,
  PASS_PERCENTAGE,
} from '@/types';
import { prepareQuizQuestions, checkAnswer, calculateStats } from '@/utils/quizUtils';
import { Question } from '@/types';

interface QuizStore {
  session: QuizSession | null;
  result: QuizResult | null;

  // Actions
  startQuiz: (config: QuizConfig, allQuestions: Question[]) => void;
  submitAnswer: (selected: string | string[] | null) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  finishQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  session: null,
  result: null,

  startQuiz: (config, allQuestions) => {
    const count = config.questionCount === 'all' ? allQuestions.length : config.questionCount;
    const questions = prepareQuizQuestions(allQuestions, count);

    const session: QuizSession = {
      config,
      questions,
      answers: [],
      currentIndex: 0,
      score: 0,
      isCompleted: false,
      showAnswer: false,
      startedAt: Date.now(),
    };

    set({ session, result: null });
  },

  submitAnswer: (selected) => {
    const { session } = get();
    if (!session || session.showAnswer) return;

    const question = session.questions[session.currentIndex];
    const isCorrect = checkAnswer(selected, question.shuffledCorrectAnswer, question.isMultiAnswer);

    const answer: QuizAnswer = {
      questionId: question.id,
      selectedAnswer: selected,
      isCorrect,
      correctAnswer: question.correctAnswer,
      shuffledCorrectAnswer: question.shuffledCorrectAnswer,
    };

    set({
      session: {
        ...session,
        answers: [...session.answers, answer],
        score: isCorrect ? session.score + 1 : session.score,
        showAnswer: true,
      },
    });
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return;

    const nextIndex = session.currentIndex + 1;
    const isLast = nextIndex >= session.questions.length;

    if (isLast) {
      get().finishQuiz();
    } else {
      set({
        session: {
          ...session,
          currentIndex: nextIndex,
          showAnswer: false,
        },
      });
    }
  },

  finishQuiz: () => {
    const { session } = get();
    if (!session) return;

    const now = Date.now();
    const timeTakenSeconds = Math.round((now - session.startedAt) / 1000);
    const { total, correct, wrong, percentage } = calculateStats(session.answers);

    const result: QuizResult = {
      studentName: session.config.studentName,
      categoryName: session.config.categoryName,
      moduleName: session.config.moduleName,
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      percentage,
      passed: percentage >= PASS_PERCENTAGE,
      timeTakenSeconds,
    };

    set({
      session: {
        ...session,
        isCompleted: true,
        completedAt: now,
      },
      result,
    });
  },

  resetQuiz: () => {
    set({ session: null, result: null });
  },
}));
