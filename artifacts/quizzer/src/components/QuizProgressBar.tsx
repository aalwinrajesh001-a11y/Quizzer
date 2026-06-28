import { motion } from 'framer-motion';

interface QuizProgressBarProps {
  current: number;
  total: number;
  score: number;
}

export function QuizProgressBar({ current, total, score }: QuizProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span data-testid="text-progress">
          Question <span className="font-bold text-gray-800 dark:text-gray-100">{current}</span> of{' '}
          <span className="font-bold text-gray-800 dark:text-gray-100">{total}</span>
        </span>
        <span data-testid="text-score">
          Score: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span>
          <span className="text-gray-400"> / {current}</span>
        </span>
      </div>

      {/* Progress bar track */}
      <div className="h-2.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
