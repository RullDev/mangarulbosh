
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:ring-2 hover:ring-primary transition-all"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={darkMode ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {darkMode ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" 
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              />
              <motion.path 
                d="M12 2V4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.path 
                d="M12 20V22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.path 
                d="M4.93 4.93L6.34 6.34" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.path 
                d="M17.66 17.66L19.07 19.07" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              <motion.path 
                d="M2 12H4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.path 
                d="M20 12H22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.path 
                d="M6.34 17.66L4.93 19.07" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.path 
                d="M19.07 4.93L17.66 6.34" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ rotate: -45 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
