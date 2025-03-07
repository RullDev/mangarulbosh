import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No comics found</p>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {comics.map((comic, index) => (
        <motion.div
          key={index}
          variants={item}
          whileHover={{ y: -5 }}
          className="comic-card overflow-hidden"
        >
          <Link to={`/comic/${comic.slug}`} className="block">
            <div className="relative aspect-[2/3] overflow-hidden">
              {comic.cover ? (
                <img
                  src={comic.cover}
                  alt={comic.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs mt-2 text-gray-400">No image available</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex justify-between items-center">
                  <div className="px-2 py-0.5 text-xs rounded-full bg-primary/80 text-white">
                    {comic.type || 'Unknown'}
                  </div>

                  {comic.score && (
                    <div className="flex items-center text-xs text-yellow-400">
                      <FaStar className="mr-1" />
                      {comic.score}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">{comic.title}</h3>
              {comic.chapter && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comic.chapter}</p>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ComicGrid;