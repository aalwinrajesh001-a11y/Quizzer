import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'reveal-correct';

interface OptionButtonProps {
  optionId: string;
  text: string;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
  index: number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function OptionButton({ optionId, text, state, disabled, onClick, index }: OptionButtonProps) {
  const isCorrect = state === 'correct' || state === 'reveal-correct';
  const isIncorrect = state === 'incorrect';
  const isSelected = state === 'selected' || state === 'correct' || state === 'incorrect';

  let bgClass = 'bg-white/70 dark:bg-white/6 border-sky-200 dark:border-white/10 hover:bg-sky-50/80 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500/50';
  let textClass = 'text-gray-800 dark:text-gray-200';
  let labelClass = 'bg-sky-100 dark:bg-white/10 text-sky-700 dark:text-gray-300';

  if (isCorrect) {
    bgClass = 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-500';
    textClass = 'text-emerald-800 dark:text-emerald-200';
    labelClass = 'bg-emerald-400 dark:bg-emerald-500 text-white';
  } else if (isIncorrect) {
    bgClass = 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-500';
    textClass = 'text-red-800 dark:text-red-200';
    labelClass = 'bg-red-400 dark:bg-red-500 text-white';
  } else if (isSelected) {
    bgClass = 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500';
    textClass = 'text-blue-800 dark:text-blue-200';
    labelClass = 'bg-blue-500 text-white';
  }

  return (
    <motion.button
      data-testid={`button-option-${optionId}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={!disabled ? { scale: 1.01, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 backdrop-blur-sm
        text-left transition-all duration-200 cursor-pointer disabled:cursor-default
        ${bgClass}`}
    >
      {/* Option label (A/B/C/D) */}
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
        transition-all duration-200 ${labelClass}`}>
        {OPTION_LABELS[index] ?? optionId.toUpperCase()}
      </span>

      {/* Option text */}
      <span className={`flex-1 text-sm font-medium leading-relaxed ${textClass}`}>
        {text}
      </span>

      {/* Status icon */}
      {isCorrect && <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />}
      {isIncorrect && <XCircle size={20} className="shrink-0 text-red-500" />}
    </motion.button>
  );
}
