
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {comics.map((comic, index) => (
        <motion.div key={comic.slug + index} variants={item}>
          <Link to={`/comic/${comic.slug}`} className="block">
            <div className="comic-card h-full flex flex-col">
              <div className="relative overflow-hidden rounded-t-lg aspect-[3/4]">
                <img 
                  src={comic.cover || 'https://via.placeholder.com/300x400?text=No+Image'} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=Error+Loading';
                  }}
                />
                {comic.status && (
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    comic.status.toLowerCase().includes('ongoing') 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-blue-500/80 text-white'
                  }`}>
                    {comic.status}
                  </div>
                )}
              </div>
              
              <div className="p-2 flex-grow flex flex-col justify-between">
                <h3 className="font-medium text-sm text-gray-800 dark:text-white line-clamp-1">
                  {comic.title}
                </h3>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className={`px-1.5 py-0.5 text-2xs rounded ${
                    comic.type?.toLowerCase().includes('manga') 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                      : comic.type?.toLowerCase().includes('manhwa')
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'
                        : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                  }`}>
                    {comic.type || 'Unknown'}
                  </div>
                  
                  <div className="flex items-center text-xs text-yellow-500">
                    <FaStar className="mr-0.5" />
                    {comic.score || 'N/A'}
                  </div>
                </div>
                
                {comic.chapter && (
                  <div className="mt-1.5 text-2xs text-gray-600 dark:text-gray-400">
                    {comic.chapter}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ComicGrid;
