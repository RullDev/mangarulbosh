
import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  // Define size classes
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl'
  };

  // Define container classes based on size
  const containerClasses = {
    small: 'py-2',
    medium: 'py-4',
    large: 'py-8'
  };
  
  // Define text size classes
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  // Animation variants for the spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };

  // Animation variants for the text
  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <motion.div
        className={`text-primary ${sizeClasses[size]}`}
        variants={spinnerVariants}
        animate="animate"
      >
        <FaSpinner />
      </motion.div>
      
      {message && (
        <motion.p 
          className={`mt-3 text-gray-300 font-medium ${textSizeClasses[size]}`}
          variants={textVariants}
          animate="animate"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
