import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics = [] }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No comics available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {comics.map((comic, index) => (
        <ComicCard key={comic.id || index} comic={comic} index={index} />
      ))}
    </div>
  );
};

const ComicCard = ({ comic, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.05 // Stagger effect
      }
    }
  };

  // Truncate the title if it's too long
  const truncateTitle = (title) => {
    if (title.length > 28) {
      return title.substring(0, 25) + '...';
    }
    return title;
  };

  // Determine country flag based on comic type
  const getCountryFlag = (type) => {
    if (!type) return null;

    const lowerType = type.toLowerCase();
    if (lowerType === 'manga') return '🇯🇵';
    if (lowerType === 'manhwa') return '🇰🇷';
    if (lowerType === 'manhua') return '🇨🇳';
    return null;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="comic-card"
    >
      <Link to={`/info/${comic.slug}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={comic.cover} 
            alt={comic.title} 
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>

        {/* Title and chapter overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 text-white">
          <h3 className="font-bold text-sm leading-tight mb-1">
            {truncateTitle(comic.title)}
          </h3>

          {comic.chapters && comic.chapters.length > 0 && (
            <p className="text-xs text-gray-300">
              Chapter {comic.chapters[0].number || '??'}
            </p>
          )}
        </div>

        {/* Rating badge */}
        {comic.score && (
          <div className="absolute top-1 right-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs font-bold flex items-center">
            <FaStar className="mr-0.5 text-yellow-300" size={10} /> 
            <span>{comic.score}</span>
          </div>
        )}

        {/* Country flag badge */}
        {getCountryFlag(comic.type) && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold">
            {getCountryFlag(comic.type)}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default ComicGrid;