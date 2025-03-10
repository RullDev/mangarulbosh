
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const ComicCard = ({ comic, isFavorite, onToggleFavorite }) => {
  // Ensure all required properties exist
  const {
    slug = '',
    title = 'Unknown Title',
    cover = 'https://via.placeholder.com/300x450?text=No+Image',
    type = '',
    status = '',
    score = '',
    chapter = ''
  } = comic || {};

  const isValidCover = cover && !cover.includes('undefined') && !cover.includes('null');
  const imageUrl = isValidCover ? cover : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <motion.div
      className="comic-card bg-zinc-900/60 border border-zinc-800/80 overflow-hidden rounded-xl"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden group">
        <Link to={`/comic/${slug}`} className="block">
          <div className="w-full aspect-[2/3] overflow-hidden">
            <motion.img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>
          
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
            {type && (
              <span className="px-2 py-1 text-xs bg-primary/90 text-white rounded-md font-medium">
                {type}
              </span>
            )}
            
            {score && (
              <span className="px-2 py-1 text-xs bg-yellow-600/90 text-white rounded-md font-medium flex items-center gap-1">
                <FaStar className="text-yellow-300" /> {score}
              </span>
            )}
          </div>
          
          {status && (
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                status.toLowerCase().includes('ongoing') 
                  ? 'bg-green-600/90 text-green-50' 
                  : 'bg-blue-600/90 text-blue-50'
              }`}>
                {status}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        
        {onToggleFavorite && (
          <motion.button
            className="absolute top-2 right-2 z-10 text-white p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleFavorite(comic)}
          >
            {isFavorite ? (
              <FaBookmark className="text-primary" size={16} />
            ) : (
              <FaRegBookmark size={16} />
            )}
          </motion.button>
        )}
      </div>
      
      <div className="p-3">
        <Link to={`/comic/${slug}`} className="block">
          <h3 className="font-semibold text-white truncate hover:text-primary transition-colors">
            {title}
          </h3>
          
          {chapter && (
            <p className="text-sm text-zinc-400 mt-1 truncate">
              {chapter}
            </p>
          )}
        </Link>
      </div>
    </motion.div>
  );
};

export default ComicCard;
