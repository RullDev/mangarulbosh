
import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaStarOfLife } from 'react-icons/fa';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      className="relative w-14 h-8 rounded-full overflow-hidden flex items-center cursor-pointer"
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.95 }}
      style={{ 
        backgroundColor: darkMode ? '#1e293b' : '#e0f2fe',
        border: `2px solid ${darkMode ? '#334155' : '#bae6fd'}`
      }}
    >
      {/* Track background with stars for dark mode */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={false}
        animate={{ opacity: darkMode ? 1 : 0 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-yellow-200/70"
            style={{ 
              fontSize: `${Math.random() * 6 + 4}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
            }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <FaStarOfLife />
          </motion.div>
        ))}
      </motion.div>

      {/* Circle for sun/moon */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center"
        animate={{ 
          x: darkMode ? '100%' : '0%',
          translateX: darkMode ? -18 : 5, 
          scale: [1, 1.05, 1],
          backgroundColor: darkMode ? '#1e40af' : '#fbbf24' 
        }}
        transition={{ 
          x: { type: "spring", stiffness: 300, damping: 20 },
          backgroundColor: { duration: 0.2 }
        }}
        style={{
          width: 26,
          height: 26
        }}
      >
        {/* Sun rays animation */}
        {!darkMode && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-yellow-300"
                style={{
                  width: '2px',
                  height: '4px',
                  borderRadius: '1px',
                  transformOrigin: 'center 13px',
                  transform: `rotate(${i * 45}deg)`,
                  left: 'calc(50% - 1px)',
                  top: '-3px'
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.15
                }}
              />
            ))}
          </>
        )}

        {/* Moon crater animations */}
        {darkMode && (
          <>
            {[
              { top: '30%', left: '25%', size: '4px' },
              { top: '40%', left: '60%', size: '3px' },
              { top: '60%', left: '40%', size: '5px' },
            ].map((crater, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-300/30 rounded-full"
                style={{
                  width: crater.size,
                  height: crater.size,
                  top: crater.top,
                  left: crater.left
                }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Icons that fade in and out */}
      <motion.div 
        className="absolute left-1.5 text-yellow-600"
        animate={{ opacity: darkMode ? 0 : 0.8, scale: darkMode ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <FaSun className="text-xs" />
      </motion.div>

      <motion.div 
        className="absolute right-1.5 text-blue-300"
        animate={{ opacity: darkMode ? 0.8 : 0, scale: darkMode ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <FaMoon className="text-xs" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
