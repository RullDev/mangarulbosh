
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-primary/30 dark:bg-primary-dark/30"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 border-t-4 border-l-4 border-primary dark:border-primary-dark rounded-full"
        />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
