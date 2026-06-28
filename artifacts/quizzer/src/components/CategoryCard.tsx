import { motion } from 'framer-motion';
import { ArrowRight, Monitor, BookOpen, Award } from 'lucide-react';
import { Category } from '@/types';
import { getTotalQuestionCount } from '@/services/questionBank';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor,
  BookOpen,
  Award,
};

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, onClick, index }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] ?? BookOpen;
  const totalQuestions = getTotalQuestionCount(category.modules);
  const moduleCount = category.modules.length;

  return (
    <motion.div
      data-testid={`card-category-${category.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10
        bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl
        transition-all duration-300 p-6">

        {/* Gradient background glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

        {/* Animated border gradient on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))' }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon size={28} className="text-white" />
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{category.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{category.description}</p>

          {/* Stats */}
          <div className="flex gap-4 mb-5">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{moduleCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
            </div>
            <div className="w-px bg-gray-200 dark:bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuestions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
            </div>
          </div>

          {/* CTA */}
          <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            <span>Explore modules</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} className="text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
