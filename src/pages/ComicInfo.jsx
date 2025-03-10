
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaExclamationTriangle, FaBookOpen, FaHeart, FaRegHeart, FaList, FaInfoCircle, FaCalendarAlt, FaUserAlt, FaSpinner } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comicInfo = await Comic.getInfo(id);
        setComic(comicInfo);

        const comicChapters = await Comic.getChapters(id);
        setChapters(comicChapters);
      } catch (err) {
        console.error("Error fetching comic info:", err);
        const errorMessage = err.response?.status === 403 
          ? "Access denied. The server blocked this request. Please try again later."
          : "Failed to load comic information. Please try again later.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if comic is in favorites
    const checkFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === id));
    };

    if (id) {
      fetchComicInfo();
      checkFavorites();
    }
  }, [id, retryCount]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, { 
        id, 
        title: comic.title, 
        coverImage: comic.coverImage,
        type: comic.type,
        status: comic.status,
        latestChapter: chapters[0]?.number || 'N/A'
      }];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
    setIsFavorite(!isFavorite);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading comic information..." />;
  }

  if (error) {
    return (
      <div className="container-custom min-h-screen bg-black py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <FaChevronLeft />
            <span>Go Back</span>
          </button>
          
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4">
            <FaExclamationTriangle className="text-red-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center">Error Loading Comic</h2>
            <p className="text-center">{error}</p>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors flex items-center gap-2"
              >
                Try Again
              </button>
              <Link 
                to="/"
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors flex items-center gap-2"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
          Comic not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Back button */}
      <div className="container-custom pt-4">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
          <FaChevronLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Comic banner/cover */}
      <div className="relative h-60 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={comic.coverImage} 
          alt={comic.title} 
          className="w-full h-full object-cover object-center blur-sm opacity-30"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/1200x800?text=No+Banner';
          }}
        />
      </div>

      {/* Comic info */}
      <div className="container-custom -mt-24 relative z-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover image */}
          <div className="w-40 md:w-56 flex-shrink-0 group">
            <div className="relative overflow-hidden rounded-lg shadow-lg border border-zinc-800 transform transition-transform duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
              <img 
                src={comic.coverImage} 
                alt={comic.title} 
                className="w-full transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/500x700?text=No+Image';
                }}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              {chapters.length > 0 && (
                <Link 
                  to={`/read/${id}/${chapters[0].id}`} 
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
                >
                  <FaBookOpen />
                  <span>Read</span>
                </Link>
              )}
              
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-md transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'}`}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{comic.title}</h1>

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

            <div className="text-zinc-400 mb-6 space-y-2">
              {comic.author && (
                <p className="flex items-center gap-2">
                  <FaUserAlt className="text-zinc-500" size={14} />
                  <span><strong>Author:</strong> {comic.author}</span>
                </p>
              )}
              
              {comic.releaseDate && (
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-zinc-500" size={14} />
                  <span><strong>Released:</strong> {comic.releaseDate}</span>
                </p>
              )}
              
              {comic.genres && (
                <div className="mt-3">
                  <strong className="flex items-center gap-2">
                    <FaList className="text-zinc-500" size={14} />
                    Genres:
                  </strong>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {comic.genres.map((genre, index) => (
                      <span key={index} className="bg-zinc-800 px-2 py-1 text-xs rounded-full text-zinc-300 hover:bg-zinc-700 transition-colors">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {comic.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaInfoCircle className="text-primary" />
                  Synopsis
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{comic.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chapters list */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaList className="text-primary" />
            Chapters ({chapters.length})
          </h2>

          {chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/read/${id}/${chapter.id}`}
                  className="bg-zinc-900/80 hover:bg-zinc-800 rounded-lg p-3 transition-colors border border-zinc-800/50 hover:border-zinc-700 flex items-center"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-white">Chapter {chapter.number}</span>
                    {chapter.title && (
                      <span className="block text-sm text-zinc-400 truncate">{chapter.title}</span>
                    )}
                  </div>
                  {chapter.date && (
                    <span className="text-xs text-zinc-500">{chapter.date}</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
              No chapters available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComicInfo;
