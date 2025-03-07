import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} rounded-full bg-primary/20`}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Main spinner */}
        <div className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary rounded-full animate-spin`}></div>

        {/* Inner dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full"
          style={{ 
            width: size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px',
            height: size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'
          }}
          animate={{ 
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {message && (
        <motion.p 
          className="mt-4 text-gray-600 dark:text-gray-300 text-center font-medium text-sm md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;