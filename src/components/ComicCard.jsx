
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../App';

const ComicCard = ({ comic }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="comic-card overflow-hidden rounded-lg shadow-md"
    >
      <Link to={`/info/${comic.slug}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={comic.cover} 
            alt={comic.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x600?text=No+Image';
            }}
          />
          
          {/* Dark overlay at the bottom for text */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <h3 className="font-bold text-white text-base truncate">{comic.title}</h3>
            <div className="flex items-center mt-1">
              <span className="text-gray-300 text-xs">
                {comic.latest_chapter ? `Chapter ${comic.latest_chapter}` : 'New'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;
