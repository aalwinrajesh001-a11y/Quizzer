import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, BookOpen } from 'lucide-react';
import { ModuleCard } from '@/components/ModuleCard';
import { useCategoryStore } from '@/stores/categoryStore';
import { useQuizStore } from '@/stores/quizStore';
import { QuizModule } from '@/types';
import { getTotalQuestionCount } from '@/services/questionBank';

export default function CategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;
  const [, setLocation] = useLocation();
  const { categories, isLoaded, refresh } = useCategoryStore();
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  useEffect(() => {
    if (!isLoaded) refresh();
  }, [isLoaded, refresh]);

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  // All-modules combined virtual module
  const allModule: QuizModule | null = useMemo(() => {
    if (!category) return null;
    return {
      id: 'all',
      name: `Entire ${category.name} Quiz`,
      questions: category.modules.flatMap((m) => m.questions),
    };
  }, [category]);

  const handleStartModule = (module: QuizModule, isAll = false) => {
    resetQuiz();
    // Navigate to quiz setup with module info in state via URL params
    const slug = isAll ? 'all' : module.id;
    setLocation(`/category/${categoryId}/module/${slug}/setup`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <BookOpen size={48} className="text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">Category not found</p>
        <button onClick={() => setLocation('/')} className="text-blue-600 dark:text-blue-400 underline">
          Back to Home
        </button>
      </div>
    );
  }

  const total = getTotalQuestionCount(category.modules);

  return (
    <div className="min-h-screen pt-16">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to categories
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg shrink-0`}>
              <BookOpen size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                {category.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{category.description}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">{category.modules.length}</span> Modules
                </span>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">{total}</span> Total Questions
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Entire quiz card */}
        {allModule && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Full Quiz
              </h2>
            </div>
            <ModuleCard
              module={allModule}
              index={0}
              isSpecial
              onStart={() => handleStartModule(allModule, true)}
            />
          </div>
        )}

        {/* Individual modules */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            Individual Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.modules.map((mod, idx) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                index={idx}
                onStart={() => handleStartModule(mod)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
