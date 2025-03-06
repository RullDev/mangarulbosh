
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaTrash, FaClock, FaBook, FaExclamationCircle } from 'react-icons/fa';

const Bookmarks = () => {
  const [comics, setComics] = useState([]);
  const [readingBookmarks, setReadingBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('comics');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bookmarks from localStorage
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    setIsLoading(true);
    
    // Get series bookmarks
    const comicBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setComics(comicBookmarks);
    
    // Get reading bookmarks (chapters)
    const chapterBookmarks = JSON.parse(localStorage.getItem('readingBookmarks') || '[]');
    setReadingBookmarks(chapterBookmarks);
    
    setIsLoading(false);
  };

  const removeComicBookmark = (slug) => {
    const updatedBookmarks = comics.filter(bookmark => bookmark.slug !== slug);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setComics(updatedBookmarks);
  };

  const removeReadingBookmark = (slug) => {
    const updatedBookmarks = readingBookmarks.filter(bookmark => bookmark.slug !== slug);
    localStorage.setItem('readingBookmarks', JSON.stringify(updatedBookmarks));
    setReadingBookmarks(updatedBookmarks);
  };

  const clearAllBookmarks = () => {
    if (activeTab === 'comics') {
      localStorage.setItem('bookmarks', JSON.stringify([]));
      setComics([]);
    } else {
      localStorage.setItem('readingBookmarks', JSON.stringify([]));
      setReadingBookmarks([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="container-custom py-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white flex items-center">
          <FaBookmark className="mr-2 text-primary dark:text-primary-light" />
          Your Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your saved comics and reading progress
        </p>
      </motion.div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('comics')}
          className={`py-3 px-4 flex items-center ${
            activeTab === 'comics'
              ? 'border-b-2 border-primary dark:border-primary-light text-primary dark:text-primary-light'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FaBook className="mr-2" /> 
          Comics ({comics.length})
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`py-3 px-4 flex items-center ${
            activeTab === 'reading'
              ? 'border-b-2 border-primary dark:border-primary-light text-primary dark:text-primary-light'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FaClock className="mr-2" /> 
          Reading History ({readingBookmarks.length})
        </button>
      </div>

      {/* Clear all button */}
      {((activeTab === 'comics' && comics.length > 0) || 
        (activeTab === 'reading' && readingBookmarks.length > 0)) && (
        <motion.div 
          className="mb-6 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={clearAllBookmarks}
            className="btn btn-danger text-sm"
          >
            <FaTrash className="mr-2" />
            Clear All
          </button>
        </motion.div>
      )}

      {/* Comic bookmarks */}
      <AnimatePresence mode="wait">
        {activeTab === 'comics' && (
          <motion.div
            key="comics"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {comics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {comics.map((comic, index) => (
                  <motion.div
                    key={comic.slug}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/comic/${comic.slug}`} className="block relative">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={comic.cover || 'https://via.placeholder.com/300x400?text=No+Image'}
                          alt={comic.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        {comic.type && (
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {comic.type}
                          </div>
                        )}
                        {comic.status && (
                          <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                            comic.status.toLowerCase().includes('ongoing') 
                              ? 'bg-green-500/70 text-white' 
                              : 'bg-blue-500/70 text-white'
                          }`}>
                            {comic.status}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                          {comic.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Bookmarked: {formatDate(comic.timestamp)}
                        </p>
                      </div>
                    </Link>
                    <div className="px-4 pb-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeComicBookmark(comic.slug)}
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                        title="Remove bookmark"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <FaBookmark className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Bookmarked Comics
                </h3>
                <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto mb-6">
                  You haven't bookmarked any comics yet. Browse comics and click the bookmark icon to save them here.
                </p>
                <Link to="/" className="btn btn-primary">
                  Browse Comics
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Reading history */}
        {activeTab === 'reading' && (
          <motion.div
            key="reading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {readingBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {readingBookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.slug}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <Link to={`/read/${bookmark.slug}`} className="font-medium text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary-light transition-colors">
                          {bookmark.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last read: {formatDate(bookmark.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/read/${bookmark.slug}`} className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary">
                          <FaBook title="Continue reading" />
                        </Link>
                        <button
                          onClick={() => removeReadingBookmark(bookmark.slug)}
                          className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Remove from history"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <FaClock className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Reading History
                </h3>
                <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto mb-6">
                  Your reading history will appear here once you start reading chapters.
                </p>
                <Link to="/" className="btn btn-primary">
                  Find Comics to Read
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookmarks;
