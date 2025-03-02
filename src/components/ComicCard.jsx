
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ComicCard = ({ comic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="comic-card"
    >
      <Link to={`/info/${comic.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <img 
            src={comic.cover} 
            alt={comic.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
            <div className="text-white font-bold">{comic.title}</div>
            <div className="text-gray-300 text-sm">Chapter {comic.chapters && comic.chapters.length > 0 ? 
              comic.chapters[0].title.replace(/[^0-9]/g, '') || 'New' : 'New'}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;
