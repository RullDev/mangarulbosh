
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
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics }) => {
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
        duration: 0.5
      }
    }
  };
  
  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600 dark:text-gray-300">No comics found.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {comics.map((comic, index) => (
        <motion.div 
          key={index} 
          className="comic-card h-full flex flex-col"
          variants={itemVariants}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
          <Link to={`/comic/${comic.slug}`} className="block h-full">
            <div className="relative aspect-[2/3] overflow-hidden">
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
              <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-sm font-bold rounded-bl-lg">
                {comic.type}
              </div>
              <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-80 text-white px-2 py-1 text-sm font-bold">
                {comic.status}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-primary-light dark:bg-primary-dark text-white text-xs font-semibold px-2 py-1 rounded">
                  {comic.chapter}
                </span>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{comic.score}</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-2 h-12">
                {comic.title}
              </h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ComicGrid;
