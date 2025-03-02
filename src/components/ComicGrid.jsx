
import React from 'react';
import { motion } from 'framer-motion';
import ComicCard from './ComicCard';

const ComicGrid = ({ comics, title }) => {
  return (
    <div className="py-8">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6 text-dark"
        >
          {title}
        </motion.h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {comics.map((comic, index) => (
          <ComicCard key={index} comic={comic} />
        ))}
      </div>
    </div>
  );
};

export default ComicGrid;
