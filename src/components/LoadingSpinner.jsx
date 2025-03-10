
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = "md", 
  message = "Loading...", 
  fullScreen = false 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4 border-2';
      case 'lg': return 'w-12 h-12 border-4';
      case 'xl': return 'w-16 h-16 border-4';
      case 'md':
      default: return 'w-8 h-8 border-3';
    }
  };

  const spinnerClass = `spinner ${getSizeClass()} rounded-full`;
  
  const containerClass = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-black z-50" 
    : "flex flex-col items-center justify-center py-8";

  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className={containerClass}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className={spinnerClass}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
        />
      </div>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-zinc-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
