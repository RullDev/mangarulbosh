
import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full w-10 h-10 flex items-center justify-center bg-neutral-900 border border-neutral-800"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <FaMoon className="text-white" />
      ) : (
        <FaSun className="text-white" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
