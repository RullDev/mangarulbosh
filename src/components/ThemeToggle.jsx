import React from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button 
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${
        darkMode ? 'bg-gray-700' : 'bg-blue-100'
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={{ scale: 0.9 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div 
        className={`absolute left-1 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-primary' : 'bg-yellow-400'
        }`}
        initial={false}
        animate={{
          x: darkMode ? 24 : 0,
        }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {darkMode ? (
          <FaMoon className="text-xs text-white" />
        ) : (
          <FaSun className="text-xs text-yellow-800" />
        )}
      </motion.div>

      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-secondary-light opacity-10" />
        {darkMode ? (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0] 
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button 
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${
        darkMode ? 'bg-gray-700' : 'bg-blue-100'
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={{ scale: 0.9 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div 
        className={`absolute left-1 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-primary' : 'bg-yellow-400'
        }`}
        initial={false}
        animate={{
          x: darkMode ? 24 : 0,
        }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {darkMode ? (
          <FaMoon className="text-xs text-white" />
        ) : (
          <FaSun className="text-xs text-yellow-800" />
        )}
      </motion.div>
      
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-secondary-light opacity-10" />
        {darkMode ? (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0] 
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
