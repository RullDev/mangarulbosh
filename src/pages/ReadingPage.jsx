
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaHome, FaArrowRight, FaArrowUp, FaCog, FaExpand, FaCompress } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingMode, setReadingMode] = useState(localStorage.getItem('readingMode') || 'vertical');
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const fetchComic = async () => {
      setLoading(true);
      try {
        const comicApi = new Comic(slug);
        const result = await comicApi.read();
        
        if (!result || result.length === 0) {
          setError("No images found for this chapter.");
        } else {
          setImages(result);
        }
      } catch (err) {
        console.error("Error fetching comic pages:", err);
        setError("Failed to load comic pages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
    
    // Set up keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        handlePrevPage();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slug]);
  
  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (isFullscreen) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    let controlsTimeout;
    
    if (isFullscreen) {
      window.addEventListener('mousemove', handleMouseMove);
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeout);
    };
  }, [readingMode, isFullscreen]);
  
  const handleNextPage = () => {
    if (readingMode === 'single-page' && currentPage < images.length - 1) {
      setCurrentPage(prev => prev + 1);
      scrollToTop();
    }
  };
  
  const handlePrevPage = () => {
    if (readingMode === 'single-page' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const changeReadingMode = (mode) => {
    setReadingMode(mode);
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading comic pages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gray-900 text-white ${isFullscreen ? 'reading-fullscreen' : ''}`}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4"
          >
            <div className="container-custom flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link to="/" className="btn-icon">
                  <FaHome />
                </Link>
                <Link to={`/comic/${slug.split('-chapter-')[0]}`} className="btn-icon">
                  <FaArrowLeft />
                  <span className="ml-2 hidden sm:inline">Back to Info</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="btn-icon">
                    <FaCog />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden hidden group-hover:block">
                    <div className="p-2">
                      <div className="text-sm font-medium mb-2">Reading Mode</div>
                      <div className="space-y-1">
                        <button 
                          onClick={() => changeReadingMode('vertical')}
                          className={`block w-full text-left px-3 py-1.5 rounded ${readingMode === 'vertical' ? 'bg-primary' : 'hover:bg-gray-700'}`}
                        >
                          Vertical Scroll
                        </button>
                        <button 
                          onClick={() => changeReadingMode('single-page')}
                          className={`block w-full text-left px-3 py-1.5 rounded ${readingMode === 'single-page' ? 'bg-primary' : 'hover:bg-gray-700'}`}
                        >
                          Single Page
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button onClick={toggleFullscreen} className="btn-icon">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`comic-reader ${readingMode}`} ref={pageRef}>
        {readingMode === 'vertical' ? (
          <div className="vertical-reader pb-20">
            {images.map((image, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="page-container"
              >
                <img 
                  src={image.url} 
                  alt={`Page ${index + 1}`}
                  className="mx-auto max-w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Error';
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="single-page-reader">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="page-container flex justify-center items-center min-h-[calc(100vh-80px)]"
              >
                <img 
                  src={images[currentPage]?.url} 
                  alt={`Page ${currentPage + 1}`}
                  className="mx-auto max-w-full max-h-[calc(100vh-100px)] object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Error';
                  }}
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="navigation-controls fixed bottom-0 left-0 right-0 bg-black/80 p-4">
              <div className="container-custom flex items-center justify-between">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`btn-nav ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <div className="text-center">
                  <span className="text-lg font-medium">
                    {currentPage + 1} / {images.length}
                  </span>
                </div>
                
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === images.length - 1}
                  className={`btn-nav ${currentPage === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {readingMode === 'vertical' && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ReadingPage;
