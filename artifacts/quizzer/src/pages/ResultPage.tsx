import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy, XCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { formatTime } from '@/utils/quizUtils';

export default function ResultPage() {
  const [, setLocation] = useLocation();
  const { result, session, resetQuiz } = useQuizStore();
  const { refresh } = useCategoryStore();

  useEffect(() => {
    if (!result || !session) setLocation('/');
  }, [result, session, setLocation]);

  if (!result || !session) return null;

  const { studentName, categoryName, moduleName, totalQuestions, correctAnswers, wrongAnswers, percentage, passed, timeTakenSeconds } = result;

  const handleRetake = () => {
    const { config } = session;
    resetQuiz();
    refresh();
    setLocation(`/category/${config.categoryId}/module/${config.moduleId}/setup`);
  };

  const handleHome = () => {
    resetQuiz();
    setLocation('/');
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20
          ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header: Pass / Fail badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-lg font-bold mb-3
            ${passed
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
            }`}>
            {passed ? <Trophy size={20} /> : <XCircle size={20} />}
            {passed ? 'PASS' : 'FAIL'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Quiz Complete!</h1>
        </motion.div>

        {/* Main result card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden mb-5"
        >
          {/* Student info */}
          <div className="p-6 border-b border-sky-100 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-student-name">{studentName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <BookOpen size={13} />
                  {categoryName} · {moduleName}
                </p>
              </div>
            </div>
          </div>

          {/* Score circle + stats */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Circular progress */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor"
                    strokeWidth="8" className="text-gray-100 dark:text-white/10" />
                  <motion.circle
                    cx="50" cy="50" r="44" fill="none"
                    strokeWidth="8" strokeLinecap="round"
                    stroke={passed ? '#10b981' : '#ef4444'}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-extrabold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                    data-testid="text-percentage">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-4 text-center">
                  <CheckCircle size={20} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white" data-testid="text-correct">{correctAnswers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
                </div>
                <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-4 text-center">
                  <XCircle size={20} className="text-red-500 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white" data-testid="text-wrong">{wrongAnswers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Incorrect</p>
                </div>
                <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-4 text-center">
                  <Trophy size={20} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalQuestions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-4 text-center">
                  <Clock size={20} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatTime(timeTakenSeconds)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                </div>
              </div>
            </div>

            {/* Motivational message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`mt-5 rounded-xl p-4 text-center ${
                passed
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40'
                  : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40'
              }`}
            >
              <p className={`text-sm font-medium ${passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                {passed
                  ? `Great job, ${studentName.split(' ')[0]}! You passed with ${percentage}%. Keep it up! 🎉`
                  : `Don't give up, ${studentName.split(' ')[0]}! You need 50% to pass. Review the material and try again. 💪`}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            data-testid="button-retake"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetake}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold
              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
              text-white shadow-lg shadow-blue-500/30 transition-all"
          >
            <RotateCcw size={18} />
            Retake Quiz
          </motion.button>
          <motion.button
            data-testid="button-home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHome}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold
              border-2 border-sky-200 dark:border-white/20 text-sky-800 dark:text-gray-300
              hover:bg-sky-50 dark:hover:bg-white/10 transition-all"
          >
            <Home size={18} />
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
