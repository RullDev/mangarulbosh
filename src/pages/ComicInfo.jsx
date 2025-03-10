
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaBookOpen, FaArrowLeft, FaClock, FaTag, FaInfoCircle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
    return <LoadingSpinner fullScreen size="lg" message="Loading comic information..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4">
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
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-800/30 border border-zinc-700/30 p-6 rounded-xl flex flex-col items-center gap-4">
            <FaInfoCircle className="text-zinc-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center text-white">Comic Not Found</h2>
            <p className="text-center text-zinc-400">The comic you are looking for does not exist or has been removed.</p>
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
    <div className="min-h-screen bg-black">
      <div className="container-custom py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>
        
        {/* Comic info header */}
        <div className="relative overflow-hidden rounded-xl bg-zinc-900/30 border border-zinc-800/50 mb-8">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <img 
              src={comic.cover} 
              alt={comic.title} 
              className="w-full h-full object-cover object-center blur-md scale-110"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>
          
          <div className="relative z-10 p-6 flex flex-col md:flex-row gap-6">
            {/* Comic cover */}
            <div className="w-48 md:w-56 flex-shrink-0">
              <div className="bg-zinc-800 p-2 rounded-lg shadow-lg">
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
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isFavorite 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                      : 'bg-zinc-700 text-white hover:bg-zinc-600'
                  }`}
                >
                  <FaStar />
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
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-2 mb-4">
                {comic.type && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100">
                    {comic.type}
                  </span>
                )}
                {comic.status && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100">
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
                      <span key={index} className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chapters list */}
        {comic.chapters && comic.chapters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaClock className="text-primary" />
              Chapters
            </h2>
            
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
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
        )}
      </div>
    </div>
  );
};

export default ComicInfo;
