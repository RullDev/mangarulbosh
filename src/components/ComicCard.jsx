
import React from 'react';
import { Link } from 'react-router-dom';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

const ComicCard = ({ comic }) => {
  const getTypeClassName = (type) => {
    const types = {
      manga: 'bg-blue-900/60 text-blue-100',
      manhwa: 'bg-purple-900/60 text-purple-100',
      manhua: 'bg-green-900/60 text-green-100',
    };
    return types[type.toLowerCase()] || 'bg-gray-900/60 text-gray-100';
  };

  const getStatusClassName = (status) => {
    const statuses = {
      ongoing: 'bg-green-900/60 text-green-100',
      completed: 'bg-blue-900/60 text-blue-100',
    };
    return statuses[status.toLowerCase()] || 'bg-gray-900/60 text-gray-100';
  };

  return (
    <Link to={`/comic/${comic.id}`} className="group animate-fade-in">
      <div className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group-hover:translate-y-[-5px]">
        <div className="relative">
          <AspectRatio.Root ratio={2/3}>
            <img 
              src={comic.coverImage} 
              alt={comic.title} 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </AspectRatio.Root>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeClassName(comic.type)}`}>
                {comic.type}
              </span>
              {comic.status && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusClassName(comic.status)}`}>
                  {comic.status}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {comic.title}
          </h3>
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Ch. {comic.latestChapter || 'N/A'}</span>
            {comic.score && <span className="flex items-center gap-1">★ {comic.score}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicCard = ({ comic }) => {
  if (!comic) return null;

  const { id, title, cover, type, status, score } = comic;

  // Determine background class based on type
  const getTypeClass = () => {
    switch (type?.toLowerCase()) {
      case 'manga':
        return 'bg-blue-900/60 text-blue-100';
      case 'manhwa':
        return 'bg-purple-900/60 text-purple-100';
      case 'manhua':
        return 'bg-green-900/60 text-green-100';
      default:
        return 'bg-gray-900/60 text-gray-100';
    }
  };

  // Determine status class
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-900/60 text-green-100';
      case 'completed':
        return 'bg-blue-900/60 text-blue-100';
      default:
        return 'bg-gray-900/60 text-gray-100';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/comic/${id}`} className="block h-full">
        <div className="comic-card h-full flex flex-col bg-black dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 border border-gray-800">
          <div className="relative overflow-hidden aspect-[3/4]">
            <img
              src={cover || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=Error+Loading';
              }}
            />
            <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
              {type && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getTypeClass()}`}>
                  {type}
                </span>
              )}
              {score && (
                <span className="flex items-center px-2 py-0.5 text-xs rounded-full font-medium bg-yellow-900/60 text-yellow-100">
                  <FaStar className="mr-1" /> {score}
                </span>
              )}
            </div>
            {status && (
              <div className="absolute bottom-0 right-0 p-2">
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusClass()}`}>
                  {status}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 flex-grow flex flex-col justify-between">
            <h3 className="text-md font-semibold text-white line-clamp-2 mb-1">{title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;d;
