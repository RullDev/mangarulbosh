import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const spinnerSizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 0.3, 0.7],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          className={`absolute -inset-3 ${spinnerSizes[size]} rounded-full bg-primary/10`}
          variants={pulseVariants}
          animate="animate"
        />

        {/* Main spinner */}
        <div className="relative">
          <motion.div
            className={`${spinnerSizes[size]} border-3 border-gray-200/30 dark:border-gray-700/50 border-t-primary dark:border-t-primary border-b-primary/40 dark:border-b-primary/40 rounded-full`}
            animate={{ rotate: 360 }}
            transition={spinTransition}
          />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{message}</p>
          <div className="mt-1 h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full loading-pulse"></div>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;