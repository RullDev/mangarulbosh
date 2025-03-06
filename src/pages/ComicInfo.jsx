
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStar, 
  FaCalendarAlt, 
  FaUser, 
  FaBookOpen, 
  FaExclamationTriangle, 
  FaChevronDown, 
  FaChevronUp, 
  FaHeart,
  FaRegHeart,
  FaHistory,
  FaSort,
  FaFilter
} from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [expandSynopsis, setExpandSynopsis] = useState(false);
  const [chaptersToShow, setChaptersToShow] = useState(12);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setLoading(true);
      try {
        const comicApi = new Comic(slug);
        let info = await comicApi.info();
        
        // Check if we have valid info with at least some basic fields
        if (!info || (!info.title && !info.cover)) {
          // Try again with series() method as fallback
          try {
            info = await comicApi.series();
          } catch (seriesErr) {
            console.error("Error fetching comic series:", seriesErr);
          }
          
          // If still no valid info
          if (!info || (!info.title && !info.cover)) {
            // Create a minimal object from slug
            const titleFromSlug = slug.replace(/-/g, ' ')
                                      .split(' ')
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ');
            
            // Check localStorage for any saved info about this comic
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const favorite = favorites.find(fav => fav.slug === slug);
            
            if (favorite) {
              info = {
                title: favorite.title || titleFromSlug,
                cover: favorite.cover || 'https://via.placeholder.com/400x600?text=No+Image',
                type: favorite.type || 'Unknown',
                status: favorite.status || 'Unknown',
                score: favorite.score || 'N/A',
                synopsis: 'No synopsis available.',
                chapters: []
              };
            } else {
              setError("Comic information not found");
            }
          }
        }
        
        if (info && (info.title || info.cover)) {
          // Ensure all required fields have at least fallback values
          info.title = info.title || 'Unknown Title';
          info.cover = info.cover || 'https://via.placeholder.com/400x600?text=No+Image';
          info.type = info.type || 'Unknown';
          info.status = info.status || 'Unknown';
          info.score = info.score || 'N/A';
          info.chapters = info.chapters || [];
          info.genre = info.genre || [];
          info.synopsis = info.synopsis || 'No synopsis available.';
          
          setComic(info);
          
          // Check if comic is in favorites
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.some(fav => fav.slug === slug));
        }
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComicInfo();
    
    // Record this to reading history
    if (slug) {
      const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
      const now = new Date().toISOString();
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter(item => item.slug !== slug);
      
      // Add to beginning of array with timestamp
      filteredHistory.unshift({ 
        slug,
        timestamp: now
      });
      
      // Keep only last 30 items
      const trimmedHistory = filteredHistory.slice(0, 30);
      localStorage.setItem('readingHistory', JSON.stringify(trimmedHistory));
    }
  }, [slug]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter(fav => fav.slug !== slug);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      // Add to favorites
      const newFavorite = {
        slug,
        title: comic.title,
        cover: comic.cover,
        type: comic.type,
        status: comic.status,
        score: comic.score,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
    }
    
    setIsFavorite(!isFavorite);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const loadMoreChapters = () => {
    setChaptersToShow(prev => prev + 12);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading comic information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg max-w-md mx-auto">
          <FaExclamationTriangle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const sortedChapters = comic.chapters ? [...comic.chapters].sort((a, b) => {
    const getChapterNumber = (slug) => {
      const match = slug.match(/chapter-(\d+)/i);
      return match ? parseInt(match[1]) : 0;
    };
    
    const chapterA = getChapterNumber(a.slug);
    const chapterB = getChapterNumber(b.slug);
    
    return sortOrder === 'newest' 
      ? chapterB - chapterA 
      : chapterA - chapterB;
  }) : [];

  const chaptersToDisplay = sortedChapters.slice(0, chaptersToShow);

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700">
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[2/3] mx-auto"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={comic.cover}
                  alt={comic.title}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                  }}
                />
                <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold flex items-center shadow-md">
                  <FaStar className="mr-1 text-yellow-300" />
                  {comic.score}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg backdrop-blur-sm"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-500 dark:text-gray-400 text-xl" />
                  )}
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-col gap-3"
              >
                {comic.chapters && comic.chapters.length > 0 && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={`/read/${comic.chapters[0].slug}`}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl shadow-md"
                    >
                      <FaBookOpen /> Start Reading
                    </Link>
                  </motion.div>
                )}
                
                {comic.chapters && comic.chapters.length > 1 && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={`/read/${comic.chapters[comic.chapters.length > 1 ? 1 : 0].slug}`}
                      className="btn bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-full flex items-center justify-center gap-2 py-3 rounded-xl shadow-md backdrop-blur-sm"
                    >
                      <FaHistory /> Continue
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
              >
                {comic.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-6 mb-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center mr-2">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                    <p className="text-gray-800 dark:text-white font-medium">{comic.author || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-light dark:bg-secondary-dark flex items-center justify-center mr-2">
                    <FaBookOpen className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-gray-800 dark:text-white font-medium">{comic.status}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Released</p>
                    <p className="text-gray-800 dark:text-white font-medium">{comic.released || 'Unknown'}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  {comic.type && (
                    <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-primary">
                      {comic.type}
                    </span>
                  )}
                  
                  {comic.total_chapter && (
                    <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-gray-600 dark:bg-gray-700">
                      {comic.total_chapter} Chapters
                    </span>
                  )}
                  
                  {comic.updated && (
                    <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-600">
                      Updated: {comic.updated}
                    </span>
                  )}

                  {comic.status && (
                    <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-800">
                      Status: {comic.status}
                    </span>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {comic.genre && comic.genre.length > 0 ? (
                    comic.genre.map((genre, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-secondary-light dark:bg-secondary-dark text-white px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">No genres available</span>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Synopsis</h3>
                <div className={`relative ${!expandSynopsis && "max-h-32 overflow-hidden"}`}>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comic.synopsis || 'No synopsis available.'}
                  </p>
                  
                  {!expandSynopsis && comic.synopsis && comic.synopsis.length > 200 && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                  )}
                </div>
                
                {comic.synopsis && comic.synopsis.length > 200 && (
                  <button
                    onClick={() => setExpandSynopsis(!expandSynopsis)}
                    className="mt-2 text-primary dark:text-primary-light flex items-center"
                  >
                    {expandSynopsis ? 'Show Less' : 'Read More'} 
                    {expandSynopsis ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                )}
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Chapters</h3>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaSort className="text-primary" />
                  {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
            </div>
            
            {comic.chapters && comic.chapters.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chaptersToDisplay.map((chapter, index) => (
                    <Link
                      key={index}
                      to={`/read/${chapter.slug}`}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark rounded-lg p-4 transition-colors duration-300 flex flex-col"
                    >
                      <div className="font-medium line-clamp-1">{chapter.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.released}</div>
                    </Link>
                  ))}
                </div>
                
                {chaptersToShow < sortedChapters.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMoreChapters}
                      className="btn btn-primary px-6"
                    >
                      Load More Chapters
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <FaBookOpen className="mx-auto text-gray-400 text-5xl mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No chapters available.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComicInfo;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaBookOpen, FaCalendarAlt, FaUser, FaListUl, FaCheck, FaArrowLeft, FaChevronDown, FaExclamationCircle, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchComicInfo();
    checkIfBookmarked();
  }, [slug]);

  const fetchComicInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const comicApi = new Comic(slug);
      const comicData = await comicApi.series();
      
      if (!comicData || !comicData.title) {
        throw new Error('Failed to fetch comic data');
      }
      
      setComic(comicData);
    } catch (err) {
      console.error("Error fetching comic:", err);
      setError("Failed to load comic information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookmarked = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.some(bookmark => bookmark.slug === slug));
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      if (comic) {
        const newBookmark = {
          slug: slug,
          title: comic.title,
          cover: comic.cover,
          type: comic.type,
          status: comic.status,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      }
    }
    
    setIsBookmarked(!isBookmarked);
  };

  const getVisibleChapters = () => {
    if (!comic || !comic.chapters) return [];
    return showAllChapters ? comic.chapters : comic.chapters.slice(0, 10);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading comic details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <FaExclamationCircle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {error}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={fetchComicInfo} 
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom py-10 text-center">
        <p className="text-gray-600 dark:text-gray-400">Comic not found</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Hero banner with comic cover */}
      <div className="relative w-full h-64 sm:h-80 overflow-hidden">
        {/* Background blurred cover */}
        <div className="absolute inset-0 bg-black">
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `url(${comic.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
        
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowLeft />
        </motion.button>
        
        {/* Bookmark button */}
        <motion.button
          onClick={toggleBookmark}
          className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isBookmarked ? (
            <FaBookmark className="text-yellow-400" />
          ) : (
            <FaRegBookmark />
          )}
        </motion.button>
        
        {/* Comic cover and basic info */}
        <div className="container-custom h-full flex items-end pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Cover */}
            <motion.div 
              className="w-32 h-44 sm:w-40 sm:h-56 rounded-lg overflow-hidden shadow-lg border-2 border-white transform -translate-y-10"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: -10, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <img 
                src={comic.cover} 
                alt={comic.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Basic info */}
            <motion.div 
              className="text-white flex-1 pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold line-clamp-2 text-shadow">
                {comic.title}
              </h1>
              
              <div className="flex items-center gap-3 mt-2">
                {comic.score && (
                  <div className="flex items-center bg-black/30 px-2 py-1 rounded-md">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{comic.score}</span>
                  </div>
                )}
                
                {comic.type && (
                  <div className="bg-primary/80 px-2 py-1 rounded-md text-sm">
                    {comic.type}
                  </div>
                )}
                
                {comic.status && (
                  <div className={`px-2 py-1 rounded-md text-sm ${
                    comic.status.toLowerCase().includes('ongoing') 
                      ? 'bg-green-500/80' 
                      : 'bg-blue-500/80'
                  }`}>
                    {comic.status}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Info and synopsis */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {comic.author && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FaUser className="mr-2" /> Author
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium truncate">
                    {comic.author}
                  </div>
                </div>
              )}
              
              {comic.released && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FaCalendarAlt className="mr-2" /> Released
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium truncate">
                    {comic.released}
                  </div>
                </div>
              )}
              
              {comic.total_chapter && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FaListUl className="mr-2" /> Chapters
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium truncate">
                    {comic.total_chapter}
                  </div>
                </div>
              )}
              
              {comic.updated && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                    <FaCheck className="mr-2" /> Updated
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium truncate">
                    {comic.updated}
                  </div>
                </div>
              )}
            </div>
            
            {/* Synopsis */}
            {comic.synopsis && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Synopsis
                </h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className={`text-gray-700 dark:text-gray-300 ${!expandedDesc && 'line-clamp-3'}`}>
                    {comic.synopsis}
                  </p>
                  {comic.synopsis.length > 150 && (
                    <button 
                      onClick={() => setExpandedDesc(!expandedDesc)}
                      className="text-primary dark:text-primary-light mt-2 text-sm font-medium flex items-center"
                    >
                      {expandedDesc ? 'Show less' : 'Read more'}
                      <FaChevronDown className={`ml-1 transform ${expandedDesc ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Genres */}
            {comic.genre && comic.genre.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {comic.genre.map((genre, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Right column - Chapters */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Chapters
                </h2>
                {comic.chapters && comic.chapters.length > 0 && (
                  <Link 
                    to={`/read/${comic.chapters[0].slug}`}
                    className="btn btn-primary py-1 px-3 text-sm"
                  >
                    <FaBookOpen className="mr-1" /> Read First
                  </Link>
                )}
              </div>
              
              {comic.chapters && comic.chapters.length > 0 ? (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto p-1">
                    <AnimatePresence>
                      {getVisibleChapters().map((chapter, idx) => (
                        <motion.div
                          key={chapter.slug}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          exit={{ opacity: 0 }}
                          className="mb-1"
                        >
                          <Link 
                            to={`/read/${chapter.slug}`}
                            className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="font-medium text-gray-800 dark:text-white truncate">
                              {chapter.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                              {chapter.released}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {comic.chapters.length > 10 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={() => setShowAllChapters(!showAllChapters)}
                        className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        {showAllChapters ? 'Show Less' : `Show All (${comic.chapters.length})`}
                        <FaChevronDown className={`ml-2 transform ${showAllChapters ? 'rotate-180' : ''} transition-transform`} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400">No chapters available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComicInfo;
