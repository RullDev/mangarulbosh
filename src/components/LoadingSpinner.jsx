
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const getSize = () => {
    switch(size) {
      case 'sm': return 'w-6 h-6 border-2';
      case 'lg': return 'w-12 h-12 border-3';
      case 'xl': return 'w-16 h-16 border-4';
      default: return 'w-8 h-8 border-3'; // md
    }
  };

  const spinnerSize = getSize();
  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm' 
    : 'flex flex-col items-center justify-center py-10';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.div 
            className={`${spinnerSize} rounded-full border-primary/30 border-t-primary spinner loading-ring`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {message && (
          <motion.p 
            className="mt-4 text-zinc-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
