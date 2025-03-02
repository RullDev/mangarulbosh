
import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full w-14 h-7 transition-all duration-300"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="absolute inset-0 flex items-center px-1">
        <div className="w-full h-full flex items-center justify-between px-1 text-xs">
          <FaSun className={`text-yellow-500 ${darkMode ? 'opacity-50' : 'opacity-100'}`} />
          <FaMoon className={`text-blue-500 ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
        </div>
      </div>

      <motion.div
        layout
        className="absolute z-10 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
        animate={{ 
          x: darkMode ? 10 : -10,
          backgroundColor: darkMode ? "#6d28d9" : "#f97316"
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
