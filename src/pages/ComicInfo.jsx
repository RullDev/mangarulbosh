
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaArrowLeft, FaClock, FaTag, FaInfoCircle, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const ComicInfo = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chapters');

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
    <div className="min-h-screen bg-black pt-16">
      <div className="container-custom py-8">
        {/* Comic header background effect */}
        <div className="relative">
          {/* Translucent header background with cover image */}
          <div className="absolute inset-0 w-full h-64 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>
            <img 
              src={comic.cover} 
              alt="" 
              className="w-full h-full object-cover object-center opacity-30 blur-xl"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="pt-4">
            {/* Back button */}
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
              <FaArrowLeft />
              <span>Back to Home</span>
            </Link>
            
            {/* Comic info header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-zinc-900/70 border border-zinc-800/50 mb-8 backdrop-blur-sm shadow-xl"
            >              
              <div className="relative z-10 p-6 flex flex-col md:flex-row gap-6">
                {/* Comic cover */}
                <div className="w-48 md:w-56 flex-shrink-0 mx-auto md:mx-0">
                  <div className="bg-zinc-800 p-2 rounded-lg shadow-2xl">
                    <img 
                      src={comic.cover} 
                      alt={comic.title} 
                      className="w-full aspect-[2/3] object-cover object-center rounded"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={handleToggleFavorite}
                      className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        isFavorite 
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                          : 'bg-zinc-700 text-white hover:bg-zinc-600'
                      }`}
                    >
                      {isFavorite ? <FaBookmark /> : <FaStar />}
                      <span>{isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>
                    
                    {comic.chapters && comic.chapters.length > 0 && (
                      <Link
                        to={`/read/${comic.chapters[0].slug}`}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        <FaBookOpen />
                        <span>Read First Chapter</span>
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Comic details */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{comic.title}</h1>
                  
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {comic.type && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100 flex items-center">
                        {comic.type}
                      </span>
                    )}
                    {comic.status && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100 flex items-center">
                        {comic.status}
                      </span>
                    )}
                    {comic.score && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/60 text-yellow-100 flex items-center gap-1">
                        <FaStar className="inline" />
                        {comic.score}
                      </span>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 mb-6">
                    {comic.author && (
                      <div className="flex items-start gap-2">
                        <span className="text-zinc-500 min-w-[80px]">Author:</span>
                        <span className="text-white">{comic.author}</span>
                      </div>
                    )}
                    {comic.released && (
                      <div className="flex items-start gap-2">
                        <span className="text-zinc-500 min-w-[80px]">Released:</span>
                        <span className="text-white">{comic.released}</span>
                      </div>
                    )}
                    {comic.updated && (
                      <div className="flex items-start gap-2">
                        <span className="text-zinc-500 min-w-[80px]">Updated:</span>
                        <span className="text-white">{comic.updated}</span>
                      </div>
                    )}
                    {comic.total_chapter && (
                      <div className="flex items-start gap-2">
                        <span className="text-zinc-500 min-w-[80px]">Chapters:</span>
                        <span className="text-white">{comic.total_chapter}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Synopsis */}
                  {comic.synopsis && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                      <p className="text-zinc-400 leading-relaxed">{comic.synopsis}</p>
                    </div>
                  )}
                  
                  {/* Genres */}
                  {comic.genre && comic.genre.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <FaTag className="text-zinc-500" />
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {comic.genre.map((genre, index) => (
                          <span key={index} className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Content tabs */}
        {comic.chapters && comic.chapters.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
            
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 shadow-xl">
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {comic.chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      to={`/read/${chapter.slug}`}
                      className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 transition-colors"
                    >
                      <span className="text-white font-medium truncate">{chapter.title}</span>
                      <span className="text-xs text-zinc-400 shrink-0 ml-2">{chapter.released}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComicInfo;
