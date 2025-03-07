
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClass = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  const bounce = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <motion.div
          className={`${sizeClass[size]} rounded-full border-gray-300 border-t-primary animate-spin`}
          style={{ borderTopColor: 'var(--primary)' }}
        />
      </div>
      
      {message && (
        <motion.p 
          className="mt-4 text-gray-600 dark:text-gray-300 text-center"
          variants={bounce}
          animate="animate"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
