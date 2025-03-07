import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const spinnerSizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3, duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial="initial"
      animate="animate"
    >
      <motion.div className="relative" variants={circleVariants}>
        <div className={`${spinnerSizes[size]} border-4 border-gray-300 dark:border-gray-700 border-t-primary rounded-full animate-spin`}></div>
        <motion.div 
          className={`absolute inset-0 rounded-full border-2 border-primary/20`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </motion.div>

      {message && (
        <motion.p 
          className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium"
          variants={textVariants}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;