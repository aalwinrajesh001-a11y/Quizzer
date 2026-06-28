import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { useCategoryStore } from '@/stores/categoryStore';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { categories, isLoaded, refresh } = useCategoryStore();

  useEffect(() => {
    if (!isLoaded) refresh();
  }, [isLoaded, refresh]);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-gradient-to-t from-blue-500/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60
              text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
          >
            <Sparkles size={14} />
            Online Quiz Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4"
          >
            <span className="text-gray-900 dark:text-white">Welcome to </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Quizzer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Test your knowledge with our curated quiz categories.
            Track your progress and ace your certifications.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-gray-400 dark:text-gray-600"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Categories section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Select Quiz Category</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Choose a category to browse available modules and start a quiz.
          </p>
        </motion.div>

        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={idx}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
