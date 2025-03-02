import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-full w-12 h-6 relative"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="w-5 h-5 rounded-full flex items-center justify-center absolute"
        animate={{ 
          x: darkMode ? 26 : 1,
          backgroundColor: darkMode ? "#3b82f6" : "#f97316"
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {darkMode ? (
          <FaMoon className="text-white text-xs" />
        ) : (
          <FaSun className="text-white text-xs" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;