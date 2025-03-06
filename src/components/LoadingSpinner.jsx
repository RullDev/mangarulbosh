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
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  // Define sizes
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  // Animation variants for the dots
  const dotsVariants = {
    animate: {
      opacity: [0.2, 1, 0.2],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  const dotTransition = (delay) => ({
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
    delay
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <motion.div 
          className={`rounded-full border-transparent border-t-primary border-r-primary dark:border-t-primary-light dark:border-r-primary-light ${sizes[size]}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <motion.div 
          className={`absolute rounded-full border-transparent border-b-secondary border-l-secondary dark:border-b-secondary-light dark:border-l-secondary-light ${sizes[size]}`}
          animate={{ rotate: -180 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-1">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
        <div className="flex gap-1">
          <motion.div 
            className="w-1 h-1 rounded-full bg-primary dark:bg-primary-light"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={dotTransition(0)}
          />
          <motion.div 
            className="w-1 h-1 rounded-full bg-primary dark:bg-primary-light"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={dotTransition(0.15)}
          />
          <motion.div 
            className="w-1 h-1 rounded-full bg-primary dark:bg-primary-light"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={dotTransition(0.3)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
