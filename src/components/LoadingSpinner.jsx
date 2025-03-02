import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  // SVG animation properties
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className="mx-auto mb-4"
        >
          <motion.circle
            cx="30"
            cy="30"
            r="25"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            strokeDasharray="160"
            strokeDashoffset="45"
            className="text-primary dark:text-primary-light"
          />
        </motion.svg>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading content...</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;