import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaHome, FaArrowRight, FaArrowUp, FaCog, FaExpand, FaCompress, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState('vertical'); // 'vertical', 'horizontal', 'single-page'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const readerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reset state when slug changes
    setCurrentPage(0);
    setPages([]);
    setLoading(true);
    setError(null);

    const fetchPages = async () => {
      try {
        setLoading(true);
        const comicApi = new Comic(slug);
        const fetchedPages = await comicApi.read();

        if (!fetchedPages || fetchedPages.length === 0) {
          setError("No pages found for this chapter.");
        } else {
          // Filter out empty URLs
          const validPages = fetchedPages.filter(page => page.url && page.url.trim() !== '');

          if (validPages.length === 0) {
            setError("No valid pages found for this chapter.");
          } else {
            setPages(validPages);

            // Save to reading history with additional details
            try {
              // Extract comic name and chapter from slug
              const slugParts = slug.split('-');
              const chapterPart = slugParts.find(part => part.toLowerCase().includes('chapter'));
              const comicName = slugParts
                .slice(0, slugParts.indexOf(chapterPart))
                .join(' ')
                .replace(/-/g, ' ');

              const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
              const now = new Date().toISOString();

              // Remove if already exists
              const filteredHistory = history.filter(item => item.slug !== slug);

              // Add to beginning
              filteredHistory.unshift({
                slug,
                comicName: comicName || 'Unknown Comic',
                chapter: chapterPart || 'Unknown Chapter',
                timestamp: now
              });

              // Keep only last 20 items
              const trimmedHistory = filteredHistory.slice(0, 20);
              localStorage.setItem('readingHistory', JSON.stringify(trimmedHistory));
            } catch (err) {
              console.error("Error saving to reading history:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Failed to load chapter pages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();

    // Try to get saved reading mode preference
    const savedMode = localStorage.getItem('readingMode');
    if (savedMode) {
      setReadingMode(savedMode);
    }

    // Listen for keyboard navigation
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slug]);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (readerRef.current.requestFullscreen) {
        readerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleNextPage = () => {
    if (readingMode === 'single-page' && currentPage < pages.length - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (readingMode === 'horizontal' && currentPage < pages.length - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (readingMode === 'single-page' && currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    } else if (readingMode === 'horizontal' && currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const changeReadingMode = (mode) => {
    setReadingMode(mode);
    localStorage.setItem('readingMode', mode);
    setIsSettingsOpen(false);
  };

  // Extract comic and chapter info from slug
  const getComicSlug = () => {
    try {
      const parts = slug.split('-');
      const chapterIndex = parts.findIndex(part => 
        part.toLowerCase() === 'chapter' || /^ch(\d+)/.test(part)
      );

      if (chapterIndex > 0) {
        return parts.slice(0, chapterIndex).join('-');
      }
      return '';
    } catch (e) {
      return '';
    }
  };

  const comicSlug = getComicSlug();

  // Function to get chapter number
  const getChapterNumber = () => {
    const match = slug.match(/chapter[_-]?(\d+)/i) || slug.match(/ch[_-]?(\d+)/i);
    return match ? match[1] : null;
  };

  // Get current chapter number
  const currentChapter = getChapterNumber();

  // Function to navigate to next/prev chapter (would need chapter list)
  const goToNextChapter = () => {
    if (currentChapter) {
      const nextChapter = parseInt(currentChapter) + 1;
      const nextSlug = slug.replace(/chapter[_-]?(\d+)/i, `chapter-${nextChapter}`)
                          .replace(/ch[_-]?(\d+)/i, `ch-${nextChapter}`);
      navigate(`/read/${nextSlug}`);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapter && parseInt(currentChapter) > 1) {
      const prevChapter = parseInt(currentChapter) - 1;
      const prevSlug = slug.replace(/chapter[_-]?(\d+)/i, `chapter-${prevChapter}`)
                          .replace(/ch[_-]?(\d+)/i, `ch-${prevChapter}`);
      navigate(`/read/${prevSlug}`);
    }
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
          <FaExclamationTriangle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              <FaHome className="mr-2" /> Back to Home
            </Link>
            {comicSlug && (
              <Link to={`/comic/${comicSlug}`} className="btn bg-secondary text-white">
                Comic Info
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg max-w-md mx-auto">
          <FaExclamationTriangle className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">No Pages Found</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This chapter doesn't have any pages available. The source might be temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              <FaHome className="mr-2" /> Back to Home
            </Link>
            {comicSlug && (
              <Link to={`/comic/${comicSlug}`} className="btn bg-secondary text-white">
                Comic Info
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={readerRef}
      className={`${isFullscreen ? 'reading-fullscreen' : ''} reading-page`}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Top Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white p-4 backdrop-blur-sm"
          >
            <div className="container-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/" className="btn-icon">
                  <FaHome />
                </Link>
                {comicSlug && (
                  <Link to={`/comic/${comicSlug}`} className="btn-nav">
                    Back to Comic
                  </Link>
                )}
              </div>

              <div className="text-center hidden md:block">
                <h2 className="text-lg font-medium">
                  {slug.replace(/-/g, ' ')}
                </h2>
                {readingMode === 'single-page' && (
                  <p className="text-sm text-gray-400">
                    Page {currentPage + 1} of {pages.length}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button className="btn-icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                  <FaCog />
                </button>
                <button className="btn-icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64"
          >
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Reading Settings</h3>
            <div className="space-y-2">
              <button 
                onClick={() => changeReadingMode('vertical')}
                className={`w-full text-left p-2 rounded ${readingMode === 'vertical' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                Vertical Scrolling
              </button>
              <button 
                onClick={() => changeReadingMode('horizontal')}
                className={`w-full text-left p-2 rounded ${readingMode === 'horizontal' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                Horizontal Pages
              </button>
              <button 
                onClick={() => changeReadingMode('single-page')}
                className={`w-full text-left p-2 rounded ${readingMode === 'single-page' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                Single Page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comic Reader */}
      <div className={`comic-reader ${readingMode} pt-16`}>
        {readingMode === 'vertical' && (
          <div className="vertical-reader pb-16">
            {pages.map((page, index) => (
              <div key={index} className="page-container">
                <img 
                  src={page.url} 
                  alt={`Page ${index + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {readingMode === 'horizontal' && (
          <div className="horizontal-reader">
            <div 
              className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
              style={{ height: 'calc(100vh - 64px)' }}
            >
              {pages.map((page, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-full h-full flex items-center justify-center snap-center"
                >
                  <img 
                    src={page.url} 
                    alt={`Page ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {readingMode === 'single-page' && (
          <div className="single-page-reader flex justify-center items-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img 
                    src={pages[currentPage]?.url} 
                    alt={`Page ${currentPage + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${
                  currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
                } bg-black/50 p-4 rounded-r-lg text-white`}
              >
                <FaArrowLeft />
              </button>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
                  currentPage === pages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
                } bg-black/50 p-4 rounded-l-lg text-white`}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {showControls && readingMode !== 'vertical' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 text-white p-4 backdrop-blur-sm"
        >
          <div className="container-custom flex justify-between items-center">
            <button 
              onClick={goToPrevChapter}
              className="btn-nav"
              disabled={!currentChapter || parseInt(currentChapter) <= 1}
            >
              <FaArrowLeft /> Prev Chapter
            </button>

            {readingMode === 'single-page' && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`btn-icon ${currentPage === 0 ? 'opacity-50' : ''}`}
                >
                  <FaArrowLeft />
                </button>

                <span className="mx-2">
                  {currentPage + 1} / {pages.length}
                </span>

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === pages.length - 1}
                  className={`btn-icon ${currentPage === pages.length - 1 ? 'opacity-50' : ''}`}
                >
                  <FaArrowRight />
                </button>
              </div>
            )}

            <button 
              onClick={goToNextChapter}
              className="btn-nav"
            >
              Next Chapter <FaArrowRight />
            </button>
          </div>
        </motion.div>
      )}

      {/* Scroll to top button */}
      {readingMode === 'vertical' && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors z-30"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ReadingPage;