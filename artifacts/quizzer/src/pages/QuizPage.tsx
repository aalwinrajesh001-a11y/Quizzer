import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { QuizProgressBar } from '@/components/QuizProgressBar';
import { OptionButton } from '@/components/OptionButton';
import { useQuizStore } from '@/stores/quizStore';
import { formatTime } from '@/utils/quizUtils';

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const { session, submitAnswer, nextQuestion } = useQuizStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Redirect if no active session
  useEffect(() => {
    if (!session) setLocation('/');
  }, [session, setLocation]);

  // Timer
  useEffect(() => {
    if (!session || session.isCompleted) return;
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - session.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Navigate to result when completed
  useEffect(() => {
    if (session?.isCompleted) setLocation('/result');
  }, [session?.isCompleted, setLocation]);

  // Reset selected option when question changes
  useEffect(() => {
    setSelected(null);
  }, [session?.currentIndex]);

  if (!session) return null;

  const question = session.questions[session.currentIndex];
  const isAnswered = session.showAnswer;
  const isLast = session.currentIndex + 1 >= session.questions.length;
  const currentAnswer = session.answers[session.currentIndex];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelected(optionId);
  };

  const handleSubmit = () => {
    if (isAnswered) {
      nextQuestion();
    } else {
      if (!selected) return;
      submitAnswer(selected);
    }
  };

  const getOptionState = (optionId: string) => {
    if (!isAnswered) {
      return selected === optionId ? 'selected' : 'idle';
    }
    const correct = question.shuffledCorrectAnswer;
    const isCorrectOption = Array.isArray(correct) ? correct.includes(optionId) : correct === optionId;
    const wasSelected = currentAnswer?.selectedAnswer === optionId;

    if (isCorrectOption && wasSelected) return 'correct';
    if (isCorrectOption && !wasSelected) return 'reveal-correct';
    if (!isCorrectOption && wasSelected) return 'incorrect';
    return 'idle';
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Top bar: timer + module name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate max-w-xs">
            {session.config.moduleName}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-gray-600 dark:text-gray-300
            bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 backdrop-blur-sm">
            <Clock size={14} />
            {formatTime(elapsed)}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <QuizProgressBar
            current={session.currentIndex + (isAnswered ? 1 : 0)}
            total={session.questions.length}
            score={session.score}
          />
        </motion.div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={session.currentIndex}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl p-6 sm:p-8 mb-4"
          >
            {/* Question number */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Question {session.currentIndex + 1}
              </span>
              {question.isMultiAnswer && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                  Multiple correct answers
                </span>
              )}
            </div>

            {/* Question text */}
            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-relaxed mb-6">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {question.shuffledOptions.map((opt, idx) => (
                <OptionButton
                  key={opt.id}
                  optionId={opt.id}
                  text={opt.text}
                  state={getOptionState(opt.id)}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt.id)}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer feedback */}
        <AnimatePresence>
          {isAnswered && currentAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl p-4 mb-4 border ${
                currentAnswer.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentAnswer.isCorrect ? '✅' : '❌'}</span>
                <span className={`font-semibold text-sm ${
                  currentAnswer.isCorrect
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {currentAnswer.isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
              </div>
              {!currentAnswer.isCorrect && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  The correct answer is highlighted in green above.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit / Next button */}
        <div className="flex gap-3">
          {!isAnswered ? (
            <motion.button
              data-testid="button-submit-answer"
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={!selected}
              className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-200
                ${selected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-white/10'
                }`}
            >
              {!selected ? (
                <span className="flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  Select an answer
                </span>
              ) : 'Submit Answer'}
            </motion.button>
          ) : (
            <motion.button
              data-testid="button-next-question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-xl font-bold text-base
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
            >
              {isLast ? '🎉 See Results' : 'Next Question →'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
