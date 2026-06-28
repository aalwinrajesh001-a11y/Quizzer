import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, User, BookOpen, Hash, Play } from 'lucide-react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useQuizStore } from '@/stores/quizStore';
import { QuizConfig, QuestionCountOption, QUESTION_COUNT_OPTIONS, Question } from '@/types';

export default function QuizSetupPage() {
  const params = useParams<{ categoryId: string; moduleId: string }>();
  const { categoryId, moduleId } = params;
  const [, setLocation] = useLocation();
  const { categories, isLoaded, refresh } = useCategoryStore();
  const startQuiz = useQuizStore((s) => s.startQuiz);

  const [studentName, setStudentName] = useState('');
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>(10);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!isLoaded) refresh();
  }, [isLoaded, refresh]);

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const { module, questions } = useMemo(() => {
    if (!category) return { module: null, questions: [] };
    if (moduleId === 'all') {
      return {
        module: { id: 'all', name: `Entire ${category.name} Quiz`, questions: [] as Question[] },
        questions: category.modules.flatMap((m) => m.questions),
      };
    }
    const mod = category.modules.find((m) => m.id === moduleId);
    return { module: mod ?? null, questions: mod?.questions ?? [] };
  }, [category, moduleId]);

  const availableCountOptions = QUESTION_COUNT_OPTIONS.filter((opt) => {
    if (opt === 'all') return true;
    return (opt as number) <= questions.length;
  });

  const handleStart = () => {
    if (!studentName.trim()) {
      setNameError('Please enter your name to continue.');
      return;
    }
    if (!category || !module) return;

    const config: QuizConfig = {
      studentName: studentName.trim(),
      categoryId: category.id,
      categoryName: category.name,
      moduleId: module.id,
      moduleName: module.name,
      questionCount,
      totalAvailableQuestions: questions.length,
    };

    startQuiz(config, questions);
    setLocation('/quiz');
  };

  const displayCount = questionCount === 'all' ? questions.length : questionCount;

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category || !module) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-gray-400">Module not found</p>
        <button onClick={() => setLocation('/')} className="text-blue-600 dark:text-blue-400 underline">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => setLocation(`/category/${categoryId}`)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to modules
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{category.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              {module.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {questions.length} questions available
            </p>
          </div>

          <div className="space-y-6">
            {/* Student Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User size={15} />
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                data-testid="input-student-name"
                type="text"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) => { setStudentName(e.target.value); setNameError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-white/5 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-200
                  focus:ring-2 focus:ring-blue-500/30
                  ${nameError
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-sky-200 dark:border-white/10 focus:border-blue-500'
                  }`}
              />
              {nameError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                >
                  {nameError}
                </motion.p>
              )}
            </div>

            {/* Number of questions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Hash size={15} />
                Number of Questions
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableCountOptions.map((opt) => (
                  <motion.button
                    key={String(opt)}
                    data-testid={`button-count-${opt}`}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setQuestionCount(opt)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                      ${questionCount === opt
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'border-sky-200 dark:border-white/10 text-sky-800 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-600 bg-white/80 dark:bg-white/5'
                      }`}
                  >
                    {opt === 'all' ? `All (${questions.length})` : opt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/40">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You will answer <span className="font-bold">{displayCount}</span> randomly selected questions
                from <span className="font-bold">{module.name}</span>.
                Questions and answer options will be shuffled.
              </p>
            </div>

            {/* Start button */}
            <motion.button
              data-testid="button-start-quiz"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                text-white font-bold text-lg shadow-lg shadow-blue-500/30
                transition-all duration-200"
            >
              <Play size={20} />
              Start Quiz
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
