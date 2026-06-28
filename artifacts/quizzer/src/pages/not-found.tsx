import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-8xl mb-6"
        >
          🔍
        </motion.div>
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-2">404</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">Page not found</p>
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
              text-white font-bold shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            <Home size={18} />
            Back to Home
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
