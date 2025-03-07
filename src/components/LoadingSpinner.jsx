import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const { darkMode } = useContext(ThemeContext);

  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const sizeClass = sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClass} rounded-full border-gray-300 border-t-primary dark:border-gray-700 dark:border-t-primary animate-spin`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <p className={`mt-3 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;