import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicCard = ({ comic }) => {
  if (!comic) return null;

  return (
    <Link to={`/info/${comic.slug}`} className="block h-full">
      <motion.div 
        className="comic-card h-full flex flex-col"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image container with fixed aspect ratio */}
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img 
              src={comic.cover} 
              alt={comic.title} 
              className="w-full h-full object-cover object-top"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>

          {/* Fixed positioning badges with consistent styling */}
          <div className="absolute top-0 left-0 right-0 flex justify-between p-2">
            {comic.type && (
              <div className="bg-primary shadow-md text-white px-2 py-1 rounded-md text-xs font-bold">
                {comic.type}
              </div>
            )}
            {comic.score && (
              <div className="bg-yellow-500 shadow-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <FaStar className="text-yellow-200" /> {comic.score}
              </div>
            )}
          </div>
        </div>

        {/* Content area with fixed height */}
        <div className="p-3 flex-grow flex flex-col justify-between bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">
            {comic.title}
          </h3>

          {comic.status && (
            <div className="mt-auto pt-2">
              <span className="text-xs inline-block px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-medium">
                {comic.status}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ComicCard;