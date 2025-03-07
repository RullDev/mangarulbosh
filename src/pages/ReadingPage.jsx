import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaExpand, 
  FaCompress, 
  FaCog, 
  FaHome,
  FaArrowUp,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBook,
  FaNewspaper
} from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { ThemeContext } from '../App';

const ReadingPage = () => {
  const { slug } = useParams();
  const { darkMode } = useContext(ThemeContext);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState('vertical'); // 'vertical', 'single-page'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [comicTitle, setComicTitle] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [controlsTimeout, setControlsTimeout] = useState(null);

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

            // Try to extract chapter info from slug
            const chapterMatch = slug.match(/chapter[_-](\d+)/i);
            if (chapterMatch) {
              setCurrentChapter(chapterMatch[1]);
            } else {
              setCurrentChapter('Unknown');
            }

            // Extract comic title from slug
            const titleParts = slug.split(/chapter/i)[0] || '';
            const formattedTitle = titleParts
              .replace(/-/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
              .trim();

            setComicTitle(formattedTitle || 'Comic');

            // Fetch prev/next chapters
            try {
              // Try to extract comic slug from chapter slug
              const comicSlug = slug.split(/chapter/i)[0].slice(0, -1); // Remove trailing dash or underscore

              if (comicSlug) {
                const infoApi = new Comic(comicSlug);
                const comicInfo = await infoApi.info();

                if (comicInfo && Array.isArray(comicInfo.chapters)) {
                  // Sort chapters numerically
                  const chapters = [...comicInfo.chapters].sort((a, b) => {
                    const getChapterNum = (slug) => {
                      const match = slug.match(/chapter[_-](\d+)/i);
                      return match ? parseInt(match[1]) : 0;
                    };

                    return getChapterNum(a.slug) - getChapterNum(b.slug);
                  });

                  // Find current chapter index
                  const currentIndex = chapters.findIndex(ch => ch.slug === slug);

                  if (currentIndex !== -1) {
                    // Set previous chapter if available
                    if (currentIndex > 0) {
                      setPrevChapter(chapters[currentIndex - 1].slug);
                    }

                    // Set next chapter if available
                    if (currentIndex < chapters.length - 1) {
                      setNextChapter(chapters[currentIndex + 1].slug);
                    }

                    // Set comic title if available
                    if (comicInfo.title) {
                      setComicTitle(comicInfo.title);
                    }
                  } else {
                    // If we can't find the chapter in the list, try a fallback approach
                    if (chapterMatch) {
                      const currentChapterNum = parseInt(chapterMatch[1]);

                      // Look for adjacent chapters
                      const prevCh = chapters.find(ch => {
                        const match = ch.slug.match(/chapter[_-](\d+)/i);
                        return match && parseInt(match[1]) === currentChapterNum - 1;
                      });

                      const nextCh = chapters.find(ch => {
                        const match = ch.slug.match(/chapter[_-](\d+)/i);
                        return match && parseInt(match[1]) === currentChapterNum + 1;
                      });

                      if (prevCh) setPrevChapter(prevCh.slug);
                      if (nextCh) setNextChapter(nextCh.slug);
                    }
                  }
                }
              }
            } catch (navErr) {
              console.error("Error setting up navigation:", navErr);
              // Non-blocking error, so we don't set the main error state
            }
          }
        }
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Failed to load chapter. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();

    // Set up fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [slug]);

  useEffect(() => {
    // Set up control hiding
    if (showControls && readingMode !== 'vertical') {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      setControlsTimeout(timeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showControls, readingMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setShowControls(true);

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (readingMode === 'single-page') {
        if (currentPage < pages.length - 1) {
          setCurrentPage(currentPage + 1);
        } else {
          goToNextChapter();
        }
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (readingMode === 'single-page') {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          goToPrevChapter();
        }
      }
    } else if (e.key === 'Home') {
      setCurrentPage(0);
    } else if (e.key === 'End') {
      setCurrentPage(pages.length - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }

    // Reset control visibility when interacting
    setShowControls(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, pages.length, readingMode, prevChapter, nextChapter]);

  const goToPrevChapter = () => {
    if (prevChapter) {
      navigate(`/read/${prevChapter}`);
    }
  };

  const goToNextChapter = () => {
    if (nextChapter) {
      navigate(`/read/${nextChapter}`);
    }
  };

  const changeReadingMode = (mode) => {
    setReadingMode(mode);
    setCurrentPage(0); // Reset to first page when changing modes

    // If switching to vertical, always show controls
    if (mode === 'vertical') {
      setShowControls(true);
    }

    setIsSettingsOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <LoadingSpinner size="large" message="Loading pages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Chapter</h2>
          <p className="mb-6 text-gray-300">{error}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaArrowLeft /> Go Back
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaHome /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={readerRef}
      className={`${isFullscreen ? 'reading-fullscreen' : ''} reading-page bg-black text-white`}
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
            className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white p-3 backdrop-blur-md border-b border-gray-800/50"
          >
            <div className="container-custom flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn-icon bg-primary/90 hover:bg-primary transition-colors p-2.5 rounded-full backdrop-blur-sm"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft />
                </motion.button>
                <div>
                  <h1 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">{comicTitle}</h1>
                  <p className="text-xs text-gray-300 truncate">Chapter {currentChapter || ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn-icon"
                  onClick={toggleSettings}
                >
                  <FaCog />
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn-icon"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </motion.button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="container-custom mt-3 pb-2 overflow-hidden"
                >
                  <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">Reading Settings</h3>

                    <div className="mb-4">
                      <p className="text-sm text-gray-300 mb-2">Reading Mode</p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => changeReadingMode('vertical')}
                          className={`px-3 py-1.5 rounded-lg text-sm ${readingMode === 'vertical' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                          Vertical Scroll
                        </button>
                        <button 
                          onClick={() => changeReadingMode('single-page')}
                          className={`px-3 py-1.5 rounded-lg text-sm ${readingMode === 'single-page' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                          Single Page
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      <p>Keyboard Controls: ←/→ or A/D to navigate pages, F for fullscreen</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

        {readingMode === 'single-page' && (
          <div className="single-page-reader flex items-center justify-center min-h-screen">
            <div className="relative w-full max-w-3xl mx-auto h-full flex items-center">
              {/* Previous Page Button */}
              {currentPage > 0 && (
                <motion.button 
                  className="absolute left-2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronLeft />
                </motion.button>
              )}

              {/* Current Page */}
              <motion.div 
                className="page-container max-h-[90vh] px-4"
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={pages[currentPage]?.url} 
                  alt={`Page ${currentPage + 1}`} 
                  className="max-h-[90vh] max-w-full object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                  }}
                />
              </motion.div>

              {/* Next Page Button */}
              {currentPage < pages.length - 1 && (
                <motion.button 
                  className="absolute right-2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronRight />
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Prev/Next Chapter */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 text-white p-4 backdrop-blur-md border-t border-gray-800/50 mb-16"
        >
          <div className="container-custom flex justify-between items-center">
            <div>
              {readingMode === 'single-page' && (
                <span className="text-sm text-gray-300">
                  Page {currentPage + 1} of {pages.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={goToPrevChapter}
                className={`btn-nav ${!prevChapter ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!prevChapter}
              >
                <FaArrowLeft /> Previous Chapter
              </button>

              <button 
                onClick={goToNextChapter}
                className={`btn-nav ${!nextChapter ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!nextChapter}
              >
                Next Chapter <FaArrowRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll to top button */}
      {readingMode === 'vertical' && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-8 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors z-30"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ReadingPage;