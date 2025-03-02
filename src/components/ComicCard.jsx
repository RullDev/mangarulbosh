
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicCard = ({ comic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="comic-card"
    >
      <Link to={`/info/${comic.slug}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={comic.cover} 
            alt={comic.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-xs font-bold">
            {comic.type}
          </div>
          {comic.score && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-bold flex items-center">
              <FaStar className="mr-1" /> {comic.score}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <div className="text-white font-bold truncate">{comic.title}</div>
            <div className="text-gray-300 text-xs">{comic.status}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;
