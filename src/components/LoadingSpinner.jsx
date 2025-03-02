
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="flex flex-col justify-center items-center py-20">
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.circle
          cx="40"
          cy="40"
          r="30"
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="transparent"
        />
        <motion.circle
          cx="40"
          cy="40"
          r="30"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray="188"
          strokeDashoffset="75"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className="text-primary"
        />
      </motion.svg>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
      >
        Loading...
      </motion.span>
    </div>
  );
};

export default LoadingSpinner;
