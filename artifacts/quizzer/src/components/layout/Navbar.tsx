import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Admin', icon: Settings },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-white/85 dark:bg-black/95 backdrop-blur-xl border-b border-sky-200/60 dark:border-white/10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
                <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Quizzer
            </span>
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${location === href
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'text-sky-800 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-white/10 hover:text-sky-950 dark:hover:text-white'
                  }`}
              >
                <Icon size={15} />
                {label}
              </motion.span>
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            data-testid="button-mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sky-800 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-white/10"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden absolute top-16 left-0 right-0 bg-sky-50 dark:bg-black border-b border-sky-200 dark:border-white/10 shadow-xl"
        >
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <div
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium cursor-pointer transition-colors
                  ${location === href
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-sky-800 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-white/5'
                  }`}
              >
                <Icon size={16} />
                {label}
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
