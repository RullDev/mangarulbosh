import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      className={`p-2 rounded-full focus:outline-none shadow-lg transition-colors ${
        darkMode 
          ? 'bg-gray-800 text-yellow-300' 
          : 'bg-blue-100 text-orange-500'
      }`}
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <motion.div
          key="moon"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaMoon className="text-xl" />
        </motion.div>
      ) : (
        <motion.div
          key="sun"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaSun className="text-xl" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default ThemeToggle;