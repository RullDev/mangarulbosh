import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const spinnerSizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const dotSizes = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  const pulseDelays = [0, 0.2, 0.4, 0.6];
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Main spinner */}
        <div className="relative">
          <motion.div 
            className={`${spinnerSizes[size]} rounded-full bg-primary/10 flex items-center justify-center`}
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(var(--primary-rgb), 0.3)',
                '0 0 0 20px rgba(var(--primary-rgb), 0)',
                '0 0 0 0 rgba(var(--primary-rgb), 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`${spinnerSizes[size]} border-4 border-gray-300/30 dark:border-gray-600/30 border-t-primary border-l-primary rounded-full animate-spin`}></div>
          </motion.div>
        </div>
        
        {/* Pulse circles */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className={`absolute inset-0 rounded-full bg-primary/5`}
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Orbiting dots */}
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`absolute ${dotSizes[size]} bg-primary rounded-full shadow-md`}
              animate={{
                x: `${Math.cos(i * Math.PI / 2) * 22}px`,
                y: `${Math.sin(i * Math.PI / 2) * 22}px`,
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: pulseDelays[i]
              }}
              style={{
                left: '50%',
                top: '50%',
                marginLeft: `-${parseInt(dotSizes[size]) / 2}px`,
                marginTop: `-${parseInt(dotSizes[size]) / 2}px`
              }}
            />
          ))}
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
          <div className="flex gap-1 mt-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ 
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;