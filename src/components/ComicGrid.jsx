import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">No comics found.</p>
      </div>
    );
  }

  return (
    <div className="comic-grid">
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {comics.map((comic, index) => (
          <motion.div 
            key={`${comic.slug}-${index}`}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="comic-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
          >
            <Link to={`/info/${comic.slug}`} className="flex flex-col h-full">
              <div className="relative overflow-hidden aspect-[2/3]">
                <img 
                  src={comic.cover} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <div className="absolute top-0 right-0 bg-primary px-2 py-1 text-sm font-bold rounded-bl-lg text-white">
                  {comic.type}
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent py-4">
                  <div className="px-4 text-white">
                    <p className="font-bold line-clamp-1">{comic.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{comic.status}</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{comic.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-primary-light dark:bg-primary-dark text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {comic.chapter}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ComicGrid;