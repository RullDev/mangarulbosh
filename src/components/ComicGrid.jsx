import React from 'react';
import { motion } from 'framer-motion';
import ComicCard from './ComicCard';

const ComicGrid = ({ comics, title, subtitle }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="py-6">
        {title && <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h2>}
        {subtitle && <p className="text-gray-400 mb-6">{subtitle}</p>}

        <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-8 text-center">
          <p className="text-gray-400">No comics available in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      {title && (
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl md:text-2xl font-bold text-white mb-1"
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 mb-6"
        >
          {subtitle}
        </motion.p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {comics.map((comic, index) => (
          <motion.div
            key={comic.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <ComicCard comic={comic} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ComicGrid;