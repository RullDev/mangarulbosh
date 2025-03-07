import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaStar, FaBookmark, FaRegBookmark, FaExclamationTriangle, FaCalendarAlt, FaUser, FaListUl, FaEye } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);

  useEffect(() => {
    fetchComicInfo();
    checkIfBookmarked();
  }, [slug]);

  const fetchComicInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const comicApi = new Comic(slug);
      const comicData = await comicApi.info();

      if (!comicData || Object.keys(comicData).length === 0) {
        throw new Error('Comic information not found');
      }

      setComic(comicData);
    } catch (err) {
      console.error('Error fetching comic info:', err);
      setError('Failed to load comic information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkIfBookmarked = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('comicBookmarks')) || [];
      setIsBookmarked(bookmarks.some(bookmark => bookmark.slug === slug));
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('comicBookmarks')) || [];

      if (isBookmarked) {
        // Remove from bookmarks
        const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
        localStorage.setItem('comicBookmarks', JSON.stringify(updatedBookmarks));
      } else {
        // Add to bookmarks
        const comicBookmark = {
          slug,
          title: comic.title,
          cover: comic.cover,
          type: comic.type,
          status: comic.status,
          score: comic.score
        };

        localStorage.setItem('comicBookmarks', JSON.stringify([...bookmarks, comicBookmark]));
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
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
      <div className="container-custom py-10 min-h-screen flex flex-col items-center justify-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchComicInfo()}
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Back button */}
      <motion.button 
        className="fixed top-4 left-4 z-50 bg-gray-800/70 dark:bg-gray-800/90 text-white p-2 rounded-full backdrop-blur-sm hover:bg-primary transition-colors"
        onClick={() => window.history.back()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Go back"
      >
        <FaArrowLeft />
      </motion.button>

      {/* Comic cover and basic info */}
      <div className="relative">
        {/* Background image with overlay */}
        <div className="absolute inset-0 h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 z-10"></div>
          <img 
            src={comic.cover} 
            alt={comic.title}
            className="w-full h-full object-cover object-center blur-md opacity-50"
          />
        </div>

        <div className="container-custom relative z-20 pt-20 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Comic cover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-72 rounded-lg overflow-hidden shadow-2xl flex-shrink-0"
            >
              <img 
                src={comic.cover} 
                alt={comic.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
            </motion.div>

            {/* Comic details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center md:text-left text-white"
            >
              <h1 className="text-3xl font-bold mb-2">{comic.title}</h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  comic.status?.toLowerCase().includes('ongoing') 
                    ? 'bg-green-500/80' 
                    : 'bg-blue-500/80'
                }`}>
                  {comic.status}
                </span>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  comic.type?.toLowerCase().includes('manga') 
                    ? 'bg-blue-600/80' 
                    : comic.type?.toLowerCase().includes('manhwa')
                      ? 'bg-purple-600/80'
                      : 'bg-green-600/80'
                }`}>
                  {comic.type}
                </span>

                <div className="flex items-center px-3 py-1 bg-gray-800/50 rounded-full">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm">{comic.score || 'N/A'}</span>
                </div>
              </div>

              {/* Author, Released, Total Chapters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-sm text-gray-300">
                {comic.author && (
                  <div className="flex items-center justify-center md:justify-start">
                    <FaUser className="mr-2 text-gray-400" />
                    <span>{comic.author}</span>
                  </div>
                )}

                {comic.released && (
                  <div className="flex items-center justify-center md:justify-start">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span>{comic.released}</span>
                  </div>
                )}

                {comic.total_chapter && (
                  <div className="flex items-center justify-center md:justify-start">
                    <FaListUl className="mr-2 text-gray-400" />
                    <span>{comic.total_chapter} Chapters</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                {comic.chapters && comic.chapters.length > 0 && (
                  <Link 
                    to={`/read/${comic.chapters[0].slug}`}
                    className="btn btn-primary"
                  >
                    <FaEye className="mr-2" /> Read First Chapter
                  </Link>
                )}

                <button 
                  onClick={toggleBookmark}
                  className={`btn ${isBookmarked ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                  {isBookmarked ? (
                    <>
                      <FaBookmark className="mr-2" /> Bookmarked
                    </>
                  ) : (
                    <>
                      <FaRegBookmark className="mr-2" /> Bookmark
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comic synopsis and chapters */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Synopsis and Genres */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="md:col-span-1 order-2 md:order-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Synopsis</h2>

              <div className="relative">
                <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${!expandedSynopsis && 'line-clamp-6'}`}>
                  {comic.synopsis || 'No synopsis available.'}
                </p>

                {comic.synopsis && comic.synopsis.length > 300 && (
                  <button 
                    onClick={() => setExpandedSynopsis(!expandedSynopsis)}
                    className="text-primary dark:text-primary-light text-sm mt-2 font-medium"
                  >
                    {expandedSynopsis ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Genres */}
              {comic.genre && comic.genre.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Genres</h3>

                  <div className="flex flex-wrap gap-2">
                    {comic.genre.map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right column - Chapters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="md:col-span-2 order-1 md:order-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </span>
                  Chapters <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({comic.chapters?.length || 0})</span>
                </h2>
                
                {/* Enhanced chapter display */}
                <div className="overflow-y-auto max-h-[400px] pr-2 hide-scrollbar">
                  {comic.chapters && comic.chapters.length > 0 ? (
                    <div className="space-y-2">
                      {comic.chapters.map((chapter, index) => (
                        <div 
                          key={index}
                          className="chapter-item bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative overflow-hidden group"
                          onClick={() => navigate(`/read/${chapter.slug}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {chapter.title || `Chapter ${chapter.number || index + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                                Read &rarr;
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 to-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No chapters available</p>
                    </div>
                  )}
                </div>
              </div>

              {comic.chapters && comic.chapters.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {comic.chapters.map((chapter, index) => (
                    <Link 
                      key={index}
                      to={`/read/${chapter.slug}`}
                      className="block py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {chapter.title}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {chapter.released}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No chapters available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComicInfo;