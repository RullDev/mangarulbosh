import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaStarOfLife } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg overflow-hidden"
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.9 }}
        style={{ 
          backgroundColor: darkMode ? '#000000' : '#f0f9ff',
          border: `2px solid ${darkMode ? '#334155' : '#bae6fd'}`
        }}
      >
        {/* Background animation */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={false}
          animate={{ opacity: darkMode ? 1 : 0 }}
        >
          {/* Stars for dark mode */}
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute text-yellow-200"
              style={{ 
                fontSize: `${Math.random() * 6 + 4}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
              }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <FaStarOfLife />
            </motion.div>
          ))}
        </motion.div>

        {/* Sun icon */}
        <motion.div
          animate={{
            rotate: darkMode ? 45 : 0,
            opacity: darkMode ? 0 : 1,
            scale: darkMode ? 0.5 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="absolute"
        >
          <FaSun className="text-yellow-500 text-2xl" />
        </motion.div>

        {/* Moon icon */}
        <motion.div
          animate={{
            rotate: darkMode ? 0 : -45,
            opacity: darkMode ? 1 : 0,
            scale: darkMode ? 1 : 0.5,
          }}
          transition={{ duration: 0.5 }}
          className="absolute"
        >
          <FaMoon className="text-blue-300 text-2xl" />
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            boxShadow: darkMode 
              ? "0 0 15px 2px rgba(59, 130, 246, 0.5) inset" 
              : "0 0 15px 2px rgba(250, 204, 21, 0.5) inset" 
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
    </motion.div>
  );
};

export default ThemeToggle;