
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaArrowLeft, FaClock, FaTag, FaInfoCircle, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const ComicInfo = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const checkIfFavorite = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.slug === id));
      } catch (err) {
        console.error("Error checking favorites:", err);
        setIsFavorite(false);
      }
    };

    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const comicInstance = new Comic(id);
        const results = await comicInstance.info();
        
        if (results && Object.keys(results).length > 0) {
          setComic(results);
        } else {
          throw new Error("Comic information not found");
        }
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkIfFavorite();
    fetchComicInfo();
  }, [id, retryCount]);

  const handleToggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(fav => fav.slug !== id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } else {
        // Add to favorites
        const comicToAdd = {
          title: comic.title,
          slug: id,
          cover: comic.cover,
          score: comic.score,
          type: comic.type,
          status: comic.status
        };
        localStorage.setItem('favorites', JSON.stringify([...favorites, comicToAdd]));
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" message="Loading comic information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-10 px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4"
          >
            <FaInfoCircle className="text-red-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center">Error Loading Comic</h2>
            <p className="text-center">{error}</p>
            <div className="flex gap-4">
              <button 
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
              >
                Try Again
              </button>
              <Link 
                to="/"
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-black py-10 px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-800/30 border border-zinc-700/30 p-6 rounded-xl flex flex-col items-center gap-4"
          >
            <FaInfoCircle className="text-zinc-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center text-white">Comic Not Found</h2>
            <p className="text-center text-zinc-400">The comic you are looking for does not exist or has been removed.</p>
            <Link 
              to="/"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container-custom py-8">
        {/* Comic header background effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Translucent header background with cover image */}
          <div className="absolute inset-0 w-full h-80 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black"></div>
            <img 
              src={comic.cover} 
              alt="" 
              className="w-full h-full object-cover object-center opacity-20 blur-xl"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="pt-4">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary mb-6 transition-colors">
                <FaArrowLeft />
                <span>Back to Home</span>
              </Link>
            </motion.div>
            
            {/* Comic info header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-xl bg-zinc-900/70 border border-zinc-800/50 mb-8 backdrop-blur-sm shadow-2xl"
            >              
              {/* Decorative element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-800/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Comic cover */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-48 md:w-56 flex-shrink-0 mx-auto md:mx-0"
                >
                  <div className="relative group" onClick={() => setSelectedImage(comic.cover)}>
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2 rounded-lg shadow-2xl transform transition-transform group-hover:scale-[1.02] cursor-pointer">
                      <img 
                        src={comic.cover} 
                        alt={comic.title} 
                        className="w-full aspect-[2/3] object-cover object-center rounded"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <span className="text-white font-medium">View Larger</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleFavorite}
                      className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
                        isFavorite 
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:shadow-lg hover:shadow-yellow-500/20' 
                          : 'bg-gradient-to-r from-zinc-700 to-zinc-800 text-white hover:from-zinc-600 hover:to-zinc-700 hover:shadow-lg hover:shadow-zinc-700/20'
                      }`}
                    >
                      {isFavorite ? <FaBookmark /> : <FaStar />}
                      <span>{isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
                    </motion.button>
                    
                    {comic.chapters && comic.chapters.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/read/${comic.chapters[0].slug}`}
                          className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/20 text-white flex items-center justify-center gap-2 transition-all font-medium"
                        >
                          <FaBookOpen />
                          <span>Read First Chapter</span>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {/* Comic details */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex-1"
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{comic.title}</h1>
                  
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {comic.type && (
                      <span className="px-3 py-1.5 text-sm rounded-full bg-blue-900/60 text-blue-100 flex items-center border border-blue-800/50 shadow-md shadow-blue-900/10">
                        {comic.type}
                      </span>
                    )}
                    {comic.status && (
                      <span className="px-3 py-1.5 text-sm rounded-full bg-green-900/60 text-green-100 flex items-center border border-green-800/50 shadow-md shadow-green-900/10">
                        {comic.status}
                      </span>
                    )}
                    {comic.score && (
                      <span className="px-3 py-1.5 text-sm rounded-full bg-yellow-900/60 text-yellow-100 flex items-center gap-1 border border-yellow-800/50 shadow-md shadow-yellow-900/10">
                        <FaStar className="inline" />
                        {comic.score}
                      </span>
                    )}
                  </div>
                  
                  {/* Details grid */}
                  <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      {comic.author && (
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-400 min-w-[80px]">Author:</span>
                          <span className="text-white font-medium">{comic.author}</span>
                        </div>
                      )}
                      {comic.released && (
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-400 min-w-[80px]">Released:</span>
                          <span className="text-white font-medium">{comic.released}</span>
                        </div>
                      )}
                      {comic.updated && (
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-400 min-w-[80px]">Updated:</span>
                          <span className="text-white font-medium">{comic.updated}</span>
                        </div>
                      )}
                      {comic.total_chapter && (
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-400 min-w-[80px]">Chapters:</span>
                          <span className="text-white font-medium">{comic.total_chapter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Synopsis */}
                  {comic.synopsis && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="h-5 w-1 bg-primary rounded-full"></span>
                        Synopsis
                      </h3>
                      <p className="text-zinc-300 leading-relaxed bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">{comic.synopsis}</p>
                    </div>
                  )}
                  
                  {/* Genres */}
                  {comic.genre && comic.genre.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="h-5 w-1 bg-primary rounded-full"></span>
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {comic.genre.map((genre, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 rounded-full text-sm bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 transition-colors border border-zinc-700/50"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Content tabs */}
        {comic.chapters && comic.chapters.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex border-b border-zinc-800 mb-6">
              <button 
                className={`py-3 px-5 font-medium text-base relative ${activeTab === 'chapters' ? 'text-primary' : 'text-zinc-400 hover:text-white'}`}
                onClick={() => setActiveTab('chapters')}
              >
                <span className="flex items-center gap-2">
                  <FaClock />
                  Chapters
                </span>
                {activeTab === 'chapters' && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                  />
                )}
              </button>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 shadow-xl backdrop-blur-sm">
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {comic.chapters.map((chapter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <Link
                        to={`/read/${chapter.slug}`}
                        className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/70 hover:bg-zinc-700/80 border border-zinc-700/30 hover:border-zinc-600/50 transition-all"
                      >
                        <span className="text-white font-medium truncate">{chapter.title}</span>
                        <span className="text-xs text-zinc-400 shrink-0 ml-2 bg-zinc-900/60 py-1 px-2 rounded-full">{chapter.released}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image preview modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full max-h-[80vh] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComicInfo;
