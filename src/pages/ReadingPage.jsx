
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaArrowLeft, FaArrowRight, FaCog, FaTimes, FaList } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollInterval = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const comicApi = new Comic();
        const chapterData = await comicApi.read(slug);
        
        if (!chapterData || !chapterData.pages || chapterData.pages.length === 0) {
          setError('Chapter not found or has no pages.');
        } else {
          setChapter(chapterData);
        }
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchChapter();
    }

    // Cleanup any auto-scroll
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [slug]);

  useEffect(() => {
    // Handle auto-scroll
    if (autoScroll && containerRef.current) {
      scrollInterval.current = setInterval(() => {
        containerRef.current.scrollTop += scrollSpeed;
      }, 20);
    } else if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [autoScroll, scrollSpeed]);

  const handleZoomChange = (newZoom) => {
    setZoomLevel(Math.max(50, Math.min(200, newZoom)));
  };

  const navigateToChapter = (targetSlug) => {
    if (targetSlug) {
      navigate(`/read/${targetSlug}`);
      setShowChapters(false);
    }
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <FaHome className="mr-2" /> Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md p-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <FaHome />
          </Link>
          
          {chapter.comic && (
            <Link to={`/comic/${chapter.comic.slug}`} className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary">
              {chapter.comic.title}
            </Link>
          )}
        </div>
        
        <h1 className="text-lg font-bold text-center text-gray-900 dark:text-white">
          {chapter.title}
        </h1>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            onClick={() => setShowChapters(!showChapters)}
          >
            <FaList />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog />
          </motion.button>
        </div>
      </div>
      
      {/* Chapter Content */}
      <div 
        ref={containerRef}
        className="container mx-auto px-4 py-6 relative"
        style={{ paddingBottom: '100px' }}
      >
        <div className="max-w-3xl mx-auto" style={{ width: `${zoomLevel}%` }}>
          {chapter.pages && chapter.pages.map((page, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="mb-4"
            >
              <img
                src={page}
                alt={`Page ${index + 1}`}
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`btn ${chapter.prev ? 'btn-primary' : 'btn-secondary opacity-50'}`}
          onClick={() => chapter.prev && navigateToChapter(chapter.prev.slug)}
          disabled={!chapter.prev}
        >
          <FaArrowLeft className="mr-2" /> Previous
        </motion.button>
        
        <div className="text-center">
          <span className="text-sm font-medium dark:text-gray-300">
            {chapter.current && chapter.current.number}
          </span>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`btn ${chapter.next ? 'btn-primary' : 'btn-secondary opacity-50'}`}
          onClick={() => chapter.next && navigateToChapter(chapter.next.slug)}
          disabled={!chapter.next}
        >
          Next <FaArrowRight className="ml-2" />
        </motion.button>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-20 p-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold dark:text-white">Reading Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoom Level: {zoomLevel}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoomLevel}
                  onChange={(e) => handleZoomChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">50%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">200%</span>
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={toggleAutoScroll}
                    className="form-checkbox rounded text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-scroll
                  </span>
                </label>
                
                {autoScroll && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scroll Speed
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Slow</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Fast</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chapters List Panel */}
      <AnimatePresence>
        {showChapters && chapter.comic && chapter.comic.chapters && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-20 p-4 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold dark:text-white">Chapters</h2>
              <button 
                onClick={() => setShowChapters(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-2">
              {chapter.comic.chapters.map((chap, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => navigateToChapter(chap.slug)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chap.slug === slug 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{chap.title}</div>
                    {chap.released && (
                      <div className="text-xs mt-1 opacity-80">{chap.released}</div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingPage;
