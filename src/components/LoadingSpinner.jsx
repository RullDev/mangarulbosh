
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = "default", message = "Loading..." }) => {
  // SVG animation properties
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1.5
  };

  const circleVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.3 }
      }
    }
  };

  const sizeOptions = {
    small: { width: 30, height: 30, text: "text-sm" },
    default: { width: 50, height: 50, text: "text-base" },
    large: { width: 70, height: 70, text: "text-lg" }
  };
  
  const { width, height, text } = sizeOptions[size] || sizeOptions.default;

  return (
    <div className="flex justify-center items-center min-h-[200px] bg-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.svg
          width={width}
          height={height}
          viewBox="0 0 50 50"
          className="mx-auto mb-4"
        >
          <motion.circle
            cx="25"
            cy="25"
            r="20"
            stroke="#8b5cf6"
            strokeWidth="4"
            fill="none"
            initial="hidden"
            animate="visible"
            variants={circleVariants}
          />
          <motion.circle
            cx="25"
            cy="25"
            r="20"
            stroke="#8b5cf6"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            animate={{ rotate: 360 }}
            transition={spinTransition}
            strokeDasharray="60 120"
          />
        </motion.svg>
        <p className={`text-gray-300 font-medium ${text}`}>{message}</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
