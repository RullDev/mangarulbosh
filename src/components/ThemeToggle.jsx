
import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../App';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="rounded-full p-2 flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
    >
      {darkMode ? (
        <FaSun className="text-white text-xl" />
      ) : (
        <FaMoon className="text-gray-800 text-xl" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
