import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      data-testid="button-theme-toggle"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
        bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10
        text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/30
        transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </motion.button>
  );
}
