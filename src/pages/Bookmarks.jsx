
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ComicGrid from '../components/ComicGrid';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      setIsLoading(true);
      try {
        const savedBookmarks = localStorage.getItem('comicBookmarks');
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookmarks();
  }, []);
  
  const removeBookmark = (slug) => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
      setBookmarks(updatedBookmarks);
      localStorage.setItem('comicBookmarks', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };
  
  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      setBookmarks([]);
      localStorage.removeItem('comicBookmarks');
    }
  };
  
  return (
    <div className="container-custom py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <FaBookmark className="mr-2 text-primary" /> My Bookmarks
          </h1>
          
          {bookmarks.length > 0 && (
            <button 
              onClick={clearAllBookmarks}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm flex items-center"
            >
              <FaTrash className="mr-1" /> Clear All
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner w-10 h-10"></div>
          </div>
        ) : (
          <>
            {bookmarks.length > 0 ? (
              <div className="space-y-6">
                <ComicGrid comics={bookmarks} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-20"
              >
                <div className="mb-4">
                  <FaBookmark className="text-4xl text-gray-400 mx-auto" />
                </div>
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
                  No Bookmarks Yet
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start exploring and bookmark your favorite comics to read later.
                </p>
                <Link to="/" className="btn btn-primary">
                  Explore Comics
                </Link>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Bookmarks;
