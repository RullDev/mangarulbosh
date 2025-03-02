
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
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{comic.author || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-light dark:bg-secondary-dark flex items-center justify-center mr-2">
                    <FaBookOpen className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{comic.status}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Released</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{comic.released || 'Unknown'}</p>
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
