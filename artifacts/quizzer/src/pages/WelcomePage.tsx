import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { User, ArrowRight, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue.');
      return;
    }
    localStorage.setItem('quizzer_student_name', trimmed);
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/12 dark:bg-indigo-500/6 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30"
          >
            <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
              <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>

        {/* Card */}
        <div className="bg-white/75 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl p-8">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Sparkles size={11} />
              Welcome to Quizzer
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              What's your name?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We'll use this to personalise your quiz experience.
            </p>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User size={14} />
              Your Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/80 dark:bg-white/5
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 text-base
                ${error
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-sky-200 dark:border-white/10 focus:border-blue-500'
                }`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Button */}
          <motion.button
            whileHover={name.trim() ? { scale: 1.02 } : {}}
            whileTap={name.trim() ? { scale: 0.98 } : {}}
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
              text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all duration-200"
          >
            Continue to Quizzer
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
