import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { QuizModule } from '@/types';

interface ModuleCardProps {
  module: QuizModule;
  index: number;
  isSpecial?: boolean; // "Entire Quiz" card
  onStart: () => void;
}

export function ModuleCard({ module, index, isSpecial = false, onStart }: ModuleCardProps) {
  const questionCount = module.questions.length;

  if (isSpecial) {
    return (
      <motion.div
        data-testid={`card-module-all`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="cursor-pointer col-span-full"
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/60 dark:border-amber-500/40
          bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40
          backdrop-blur-xl shadow-xl p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Featured</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Entire NASSCOM Digital Edge 101 Quiz
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All modules combined · <span className="font-semibold text-amber-600 dark:text-amber-400">{questionCount} questions total</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500
                hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg
                transition-all duration-200 shrink-0"
            >
              Start
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid={`card-module-${module.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10
        bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-xl
        transition-all duration-300 p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Module number badge */}
            <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full
              bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-2">
              Module {index + 1}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate">
              {module.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{questionCount}</span> Questions
            </p>
          </div>

          <motion.div
            className="shrink-0 w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center
              group-hover:bg-blue-600 group-hover:dark:bg-blue-500 transition-all duration-200"
          >
            <ArrowRight size={18} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
