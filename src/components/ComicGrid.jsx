
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics, title }) => {
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
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          No comics found.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-2xl font-bold mb-6 text-dark dark:text-white"
        >
          {title}
        </motion.h2>
      )}
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
            whileHover={{ 
              y: -10, 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.3 } 
            }}
          >
            <Link to={`/comic/${comic.slug}`} className="block h-full">
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                <motion.img 
                  src={comic.cover} 
                  alt={comic.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
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
