
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark(!isDark)}
      className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div 
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center"
        animate={{ 
          x: isDark ? 24 : 0,
          backgroundColor: isDark ? '#3b82f6' : '#f97316'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? 
          <FaMoon className="text-white text-xs" /> : 
          <FaSun className="text-white text-xs" />
        }
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
