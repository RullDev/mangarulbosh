import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ComicCard = ({ comic, onToggleFavorite }) => {
  const {
    id,
    slug,
    title,
    coverImage,
    cover,
    type,
    status,
    score,
    chapter
  } = comic;

  const imageUrl = coverImage || cover;

  return (
    <motion.div 
      className="comic-card flex flex-col overflow-hidden bg-black border border-zinc-800 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/comic/${id || slug}`} className="relative block overflow-hidden aspect-[2/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        {score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/80 text-xs font-medium text-black">
            <FaStar className="text-black" />
            <span>{score}</span>
          </div>
        )}
        {type && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-blue-500/80 text-xs font-medium text-white">
            {type}
          </div>
        )}
      </Link>

      <div className="p-3">
        <Link to={`/comic/${id || slug}`} className="block">
          <h3 className="font-bold text-white truncate">
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