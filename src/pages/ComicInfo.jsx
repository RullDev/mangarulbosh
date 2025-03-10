import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookmark, FaStar, FaClock, FaGlobe, FaInfoCircle, FaExclamationTriangle, FaArrowLeft, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ComicInfo = () => {
  const { slug, id } = useParams();
  const comicId = slug || id; // Handle both URL patterns
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchComicInfo = async () => {
      if (!comicId) return;

      setLoading(true);
      setError(null);

      try {
        const comicInstance = new Comic();
        const comicData = await comicInstance.info(comicId);

        if (!comicData) {
          throw new Error("Comic information not found");
        }

        // Process data
        const processedComic = {
          ...comicData,
          coverImage: comicData.cover,
        };

        setComic(processedComic);

        // Check if comic is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.slug === comicId || fav.id === comicId));
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComicInfo();
  }, [comicId, retryCount]);

  const handleToggleFavorite = () => {
    if (!comic) return;
    
    try {
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav.slug !== comic.slug && fav.id !== comic.id);
      } else {
        // Add to favorites
        favorites.push({
          title: comic.title,
          slug: comic.slug,
          id: comic.id,
          cover: comic.cover,
          coverImage: comic.coverImage,
          type: comic.type || 'Unknown',
          status: comic.status || 'Ongoing',
          score: comic.score
        });
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading comic details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-xl text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Comic</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return null;
  }

  return (
    <ScrollArea.Root className="h-screen overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full pb-12">
        <div className="pt-16 min-h-screen bg-black">
          {/* Header with back button and actions */}
          <div className="fixed z-10 top-16 left-0 right-0 backdrop-blur-md bg-black/70 px-4 py-3 flex justify-between items-center">
            <Link to="/" className="p-2 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700/70 transition-colors">
              <FaArrowLeft />
            </Link>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${isFavorite ? 'bg-primary text-white' : 'bg-zinc-800/50 text-zinc-400'} hover:bg-primary/70 transition-colors`}
            >
              <FaBookmark />
            </button>
          </div>

          {/* Cover image with gradient overlay */}
          <div className="relative w-full h-[40vh] sm:h-[45vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
              style={{ backgroundImage: `url(${comic.coverImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:items-end container-custom gap-6 pt-12 pb-6"
            >
              <div className="w-40 h-56 sm:w-48 sm:h-72 overflow-hidden rounded-xl shadow-2xl border border-zinc-800/70 relative group">
                <img 
                  src={comic.coverImage} 
                  alt={comic.title} 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <div className="px-3 py-1 rounded-full bg-primary/80 text-white text-xs font-medium">
                    View Details
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1 sm:pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {comic.title}
                </h1>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  {comic.type && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                      {comic.type}
                    </span>
                  )}
                  {comic.status && (
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      comic.status.toLowerCase() === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {comic.status}
                    </span>
                  )}
                  {comic.score && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center">
                      <FaStar className="mr-1" /> {comic.score}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mb-3 text-sm text-zinc-400">
                  {comic.author && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Author:</span> {comic.author}
                    </div>
                  )}
                  {comic.released && (
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1.5 text-zinc-500" />
                      <span>{comic.released}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="container-custom">
            {/* Description section */}
            <div className="mt-8 mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-primary" />
                Overview
              </h2>

              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5">
                {comic.description ? (
                  <p className="text-zinc-300 leading-relaxed">
                    {comic.description}
                  </p>
                ) : (
                  <p className="text-zinc-500 italic">
                    No description available for this manga.
                  </p>
                )}

                {(comic.genres && comic.genres.length > 0) && (
                  <div className="mt-6">
                    <h3 className="text-white text-sm font-medium mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {comic.genres.map((genre, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chapters list */}
            {comic.chapters && comic.chapters.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaHistory className="text-primary" />
                  Chapters
                </h2>

                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {comic.chapters.map((chapter, index) => (
                      <Link
                        key={index}
                        to={`/read/${chapter.slug}`}
                        className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 transition-colors group relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
                        <span className="text-white font-medium truncate group-hover:text-primary transition-colors pl-2">
                          {chapter.title}
                        </span>
                        <span className="text-xs bg-zinc-700/50 text-zinc-400 shrink-0 ml-2 px-2 py-1 rounded-full group-hover:bg-zinc-600/50 group-hover:text-zinc-300 transition-colors">
                          {chapter.released}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-800/50 transition-colors duration-150 ease-out hover:bg-zinc-700/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-600 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default ComicInfo;