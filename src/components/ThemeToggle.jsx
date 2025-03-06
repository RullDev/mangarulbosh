import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      className="relative w-12 h-6 rounded-full overflow-hidden flex items-center cursor-pointer"
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.95 }}
      style={{ 
        backgroundColor: darkMode ? '#111' : '#f0f0f0',
        border: `1px solid ${darkMode ? '#333' : '#ddd'}`
      }}
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full"
        animate={{ 
          x: darkMode ? 25 : 3,
          backgroundColor: darkMode ? '#3b82f6' : '#fbbf24' 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      <motion.div 
        className="absolute left-1.5"
        animate={{ opacity: darkMode ? 0 : 1 }}
      >
        <FaSun className="text-yellow-500 text-xs" />
      </motion.div>

      <motion.div 
        className="absolute right-1.5"
        animate={{ opacity: darkMode ? 1 : 0 }}
      >
        <FaMoon className="text-blue-500 text-xs" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;