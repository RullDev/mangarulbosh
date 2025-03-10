import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, size = "md", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const dotVariants = {
    initial: { scale: 0.5, opacity: 0.3 },
    animate: { scale: 1, opacity: 1 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  const spinner = (
    <motion.div 
      className="flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`rounded-full bg-primary ${sizeClasses.sm}`}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.15
            }}
          />
        ))}
      </div>
      {message && (
        <motion.p 
          className="mt-4 text-zinc-400 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="py-16 flex justify-center">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;