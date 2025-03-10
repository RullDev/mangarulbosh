
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ComicGrid from '../components/ComicGrid';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Slight delay to show loading state
    const timer = setTimeout(() => {
      try {
        const savedBookmarks = JSON.parse(localStorage.getItem('favorites') || '[]');
        setBookmarks(savedBookmarks);
      } catch (err) {
        console.error('Error loading bookmarks:', err);
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      localStorage.setItem('favorites', '[]');
      setBookmarks([]);
    }
  };

  const removeBookmark = (slug) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('favorites', JSON.stringify(updatedBookmarks));
  };

  return (
    <ScrollArea.Root className="h-screen overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full pt-20 pb-12">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <FaBookmark className="mr-2 text-primary" /> My Bookmarks
            </h1>
            
            {bookmarks.length > 0 && (
              <button 
                onClick={clearAllBookmarks}
                className="px-3 py-1.5 bg-red-900/50 border border-red-800/50 text-white rounded-lg text-sm flex items-center hover:bg-red-800/50 transition-colors"
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ComicGrid comics={bookmarks} onToggleFavorite={removeBookmark} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-20"
                >
                  <div className="mb-4">
                    <FaBookmark className="text-5xl text-zinc-700 mx-auto" />
                  </div>
                  <h2 className="text-xl font-medium text-white mb-3">
                    No Bookmarks Yet
                  </h2>
                  <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                    Start exploring and bookmark your favorite comics to read later.
                  </p>
                  <Link to="/" className="btn bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center">
                    <FaArrowLeft className="mr-2" /> Browse Comics
                  </Link>
                </motion.div>
              )}
            </>
          )}
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

export default Bookmarks;
