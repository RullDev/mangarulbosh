import React from 'react';
import ComicCard from './ComicCard';
import { motion } from 'framer-motion';

const ComicGrid = ({ comics, onToggleFavorite }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/30 p-4 text-zinc-400 text-center">
        No comics found
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {comics.map((comic, index) => (
        <motion.div key={comic.slug || index} variants={item} transition={{ duration: 0.3 }}>
          <ComicCard comic={comic} onToggleFavorite={onToggleFavorite} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ComicGrid;