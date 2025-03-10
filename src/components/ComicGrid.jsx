
import React from 'react';
import ComicCard from './ComicCard';
import { motion } from 'framer-motion';

const ComicGrid = ({ comics = [], onToggleFavorite = null }) => {
  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
      return [];
    }
  };

  const favorites = getFavorites();
  
  // Function to check if a comic is in favorites
  const isComicFavorite = (comic) => {
    return favorites.some(fav => fav.slug === comic.slug);
  };

  const handleToggleFavorite = (comic) => {
    if (!onToggleFavorite) return;
    
    onToggleFavorite(comic);
  };

  // Check if there are any comics
  if (!comics || comics.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-zinc-400">No comics found</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {comics.map((comic, index) => (
        <ComicCard 
          key={`${comic.slug}-${index}`}
          comic={comic}
          isFavorite={isComicFavorite(comic)}
          onToggleFavorite={onToggleFavorite ? handleToggleFavorite : null}
        />
      ))}
    </motion.div>
  );
};

export default ComicGrid;
