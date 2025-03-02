
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookmark } from 'react-icons/fa';

const ComicCard = ({ comic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="comic-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
    >
      <Link to={`/info/${comic.slug}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={comic.cover} 
            alt={comic.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
            }}
          />
          
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold rounded-md">
            {comic.type}
          </div>
          
          {comic.score && (
            <div className="absolute top-2 right-2 bg-yellow-500/80 backdrop-blur-sm text-white px-2 py-1 text-xs font-bold rounded-md flex items-center">
              <FaStar className="mr-1" /> {comic.score}
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent"
          >
            <h3 className="font-bold truncate text-white text-sm md:text-base">{comic.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-300 text-xs">{comic.status}</span>
              {comic.latest_chapter && (
                <span className="text-xs bg-primary/80 px-2 py-0.5 rounded-full">
                  Ch. {comic.latest_chapter}
                </span>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <div className="bg-primary/80 text-white p-3 rounded-full backdrop-blur-md shadow-lg">
              <FaBookmark />
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;
