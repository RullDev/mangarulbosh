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
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ComicGrid = ({ comics, showScore = true }) => {
  // Handle empty state
  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No comics found</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {comics.map((comic, index) => (
        <ComicCard 
          key={`${comic.slug}-${index}`} 
          comic={comic} 
          index={index}
          showScore={showScore}
          variants={itemVariants}
        />
      ))}
    </motion.div>
  );
};

const ComicCard = ({ comic, index, showScore, variants }) => {
  const getTypeClass = (type) => {
    if (!type) return '';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('manga')) return 'type-manga';
    if (lowerType.includes('manhwa')) return 'type-manhwa';
    if (lowerType.includes('manhua')) return 'type-manhua';
    return '';
  };

  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="comic-card"
    >
      <Link to={`/comic/${comic.slug}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={comic.cover || 'https://via.placeholder.com/300x400?text=No+Image'} 
            alt={comic.title} 
            className="comic-card-image"
            loading="lazy"
          />
          {showScore && comic.score && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1 text-xs flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{comic.score}</span>
            </div>
          )}
          {comic.type && (
            <div className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full ${getTypeClass(comic.type)}`}>
              {comic.type}
            </div>
          )}
          {comic.status && (
            <div className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded-full ${
              comic.status.toLowerCase().includes('ongoing') ? 'bg-green-500/70' : 'bg-blue-500/70'
            } text-white backdrop-blur-sm`}>
              {comic.status}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-1">{comic.title}</h3>
          {comic.chapter && (
            <p className="text-xs text-gray-300 mt-1">{comic.chapter}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicGrid;
