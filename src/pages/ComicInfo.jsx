
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookmark, FaRegBookmark, FaArrowLeft, FaExclamationTriangle, FaSpinner, FaEye } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { id, slug } = useParams();
  const comicId = id || slug;
  
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const comicInstance = new Comic(comicId);
        const info = await comicInstance.info();
        
        setComic(info);
        
        // Check if this comic is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.slug === comicId));
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (comicId) {
      fetchComicInfo();
    }
  }, [comicId, retryCount]);

  const handleToggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(fav => fav.slug !== comicId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } else {
        // Add to favorites
        const comicToAdd = {
          slug: comicId,
          title: comic.title,
          cover: comic.cover,
          type: comic.type,
          status: comic.status,
          score: comic.score
        };
        favorites.push(comicToAdd);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading comic info..." />;
  }

  if (error) {
    return (
      <div className="container-custom min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4">
            <FaExclamationTriangle className="text-red-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center">Error Loading Comic</h2>
            <p className="text-center">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/"
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-6 rounded-xl flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-center">Comic Not Found</h2>
            <p className="text-center">The comic you're looking for could not be found.</p>
            <Link 
              to="/"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Hero section with cover image */}
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
          <img 
            src={comic.cover} 
            alt={comic.title}
            className="w-full h-full object-cover object-center filter blur-sm scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1200x400?text=No+Cover+Image';
            }}
          />
        </div>
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-20">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </Link>
        </div>
      </div>
      
      <div className="container-custom relative z-10 -mt-32">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Cover image */}
          <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-4">
            <motion.div 
              className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-black relative bg-zinc-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={comic.cover} 
                alt={comic.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={handleToggleFavorite}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              
              {comic.chapters && comic.chapters.length > 0 && (
                <Link
                  to={`/read/${comic.chapters[0].slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                >
                  <FaEye />
                  Start Reading
                </Link>
              )}
            </motion.div>
          </div>
          
          {/* Comic info */}
          <div className="md:w-2/3 lg:w-3/4">
            <motion.div
              className="p-6 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{comic.title}</h1>
              
              <div className="flex flex-wrap gap-2 my-4">
                {comic.type && (
                  <span className="px-3 py-1 text-sm bg-blue-900/60 text-blue-100 rounded-full">
                    {comic.type}
                  </span>
                )}
                {comic.status && (
                  <span className="px-3 py-1 text-sm bg-green-900/60 text-green-100 rounded-full">
                    {comic.status}
                  </span>
                )}
                {comic.score && (
                  <span className="px-3 py-1 text-sm bg-yellow-900/60 text-yellow-100 rounded-full flex items-center gap-1">
                    <FaStar className="text-yellow-300" /> 
                    {comic.score}
                  </span>
                )}
              </div>
              
              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {comic.author && (
                  <div>
                    <h3 className="text-zinc-400 text-sm">Author</h3>
                    <p className="text-white">{comic.author}</p>
                  </div>
                )}
                {comic.released && (
                  <div>
                    <h3 className="text-zinc-400 text-sm">Released</h3>
                    <p className="text-white">{comic.released}</p>
                  </div>
                )}
                {comic.total_chapter && (
                  <div>
                    <h3 className="text-zinc-400 text-sm">Total Chapters</h3>
                    <p className="text-white">{comic.total_chapter}</p>
                  </div>
                )}
                {comic.updated && (
                  <div>
                    <h3 className="text-zinc-400 text-sm">Updated</h3>
                    <p className="text-white">{comic.updated}</p>
                  </div>
                )}
              </div>
              
              {/* Synopsis */}
              {comic.synopsis && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                  <p className="text-zinc-300 leading-relaxed">{comic.synopsis}</p>
                </div>
              )}
              
              {/* Genres */}
              {comic.genre && comic.genre.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {comic.genre.map((genre, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-full">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Chapters */}
            {comic.chapters && comic.chapters.length > 0 && (
              <motion.div
                className="mt-6 p-6 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Chapters</h3>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {comic.chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      to={`/read/${chapter.slug}`}
                      className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors border border-zinc-700/50"
                    >
                      <span className="text-white">{chapter.title}</span>
                      <span className="text-zinc-400 text-sm">{chapter.released}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicInfo;
