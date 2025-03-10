
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaArrowRight, FaCog, FaExpand, FaCompress, 
  FaHome, FaRunning
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const [comicPages, setComicPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState('vertical'); // vertical, single, webtoon
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [pageGap, setPageGap] = useState(16);
  const readingContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const [isMarathonMode, setIsMarathonMode] = useState(false);
  const [currentComicInfo, setCurrentComicInfo] = useState(null);
  const [nextChapterSlug, setNextChapterSlug] = useState(null);
  const [showNextChapterNotification, setShowNextChapterNotification] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchComicPages = async () => {
      setLoading(true);
      try {
        const comic = new Comic(slug);
        const pages = await comic.read();

        if (!pages || pages.length === 0) {
          throw new Error('No pages found');
        }

        setComicPages(pages);

        // Get information about current comic for marathon mode
        if (slug.includes('-chapter-')) {
          const comicSlug = slug.split('-chapter-')[0];
          const comicInstance = new Comic(comicSlug);
          try {
            const comicInfo = await comicInstance.info();
            setCurrentComicInfo(comicInfo);

            // Find the next chapter if it exists
            if (comicInfo && comicInfo.chapters) {
              const currentChapterIndex = comicInfo.chapters.findIndex(chapter => chapter.slug === slug);
              if (currentChapterIndex !== -1 && currentChapterIndex < comicInfo.chapters.length - 1) {
                setNextChapterSlug(comicInfo.chapters[currentChapterIndex + 1].slug);
              }
            }
          } catch (err) {
            console.error("Error fetching comic info for marathon mode:", err);
          }
        }
      } catch (err) {
        console.error('Error fetching comic pages:', err);
        setError('Failed to load comic pages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComicPages();

    // Check if we're in marathon mode from local storage
    const marathonMode = localStorage.getItem('marathonMode') === 'true';
    setIsMarathonMode(marathonMode);

    // Load saved reader preferences
    const savedReadingMode = localStorage.getItem('readingMode') || 'vertical';
    const savedBackgroundColor = localStorage.getItem('backgroundColor') || '#000000';
    const savedPageGap = localStorage.getItem('pageGap') || '16';

    setReadingMode(savedReadingMode);
    setBackgroundColor(savedBackgroundColor);
    setPageGap(parseInt(savedPageGap));

    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [slug]);

  // Set up intersection observer for marathon mode
  useEffect(() => {
    if (!loading && isMarathonMode && nextChapterSlug && readingMode === 'vertical') {
      // Create an observer for the last image
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      const handleIntersect = (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting) {
          setShowNextChapterNotification(true);
          
          // Auto change chapter after a delay
          setTimeout(() => {
            goToNextChapter();
          }, 2000);
        }
      };

      observerRef.current = new IntersectionObserver(handleIntersect, options);
      
      // Get the last image element
      if (comicPages.length > 0) {
        const lastImageElement = document.querySelector('.comic-page:last-child');
        if (lastImageElement) {
          observerRef.current.observe(lastImageElement);
        }
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [comicPages, loading, isMarathonMode, nextChapterSlug, readingMode]);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('pageGap', pageGap.toString());
  }, [readingMode, backgroundColor, pageGap]);

  const goToNextChapter = () => {
    if (nextChapterSlug) {
      localStorage.setItem('marathonMode', 'true');
      navigate(`/read/${nextChapterSlug}`);
    } else {
      // Handle end of marathon
      const notification = document.createElement('div');
      notification.className = 'marathon-notification';
      notification.textContent = 'Marathon completed! You\'ve reached the latest chapter.';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  };

  const toggleMarathonMode = () => {
    const newMode = !isMarathonMode;
    setIsMarathonMode(newMode);
    localStorage.setItem('marathonMode', newMode ? 'true' : 'false');
    
    // Show notification
    const message = newMode ? 'Marathon mode activated!' : 'Marathon mode deactivated';
    const notification = document.createElement('div');
    notification.className = 'marathon-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (readingMode === 'single') {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        navigateToPreviousPage();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        navigateToNextPage();
      }
    }

    // Toggle fullscreen with 'f' key
    if (e.key === 'f') {
      toggleFullscreen();
    }

    // Space key to go to next chapter in marathon mode
    if (e.key === ' ' && isMarathonMode && nextChapterSlug) {
      // If we're at the last page and there's a next chapter available
      if ((readingMode === 'single' && currentPage === comicPages.length - 1) ||
          (readingMode !== 'single' && window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100)) {
        e.preventDefault(); // Prevent space from scrolling
        goToNextChapter();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const navigateToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      if (readingContainerRef.current && readingMode === 'single') {
        readingContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToNextPage = () => {
    if (currentPage < comicPages.length - 1) {
      setCurrentPage(prev => prev + 1);
      if (readingContainerRef.current && readingMode === 'single') {
        readingContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (isMarathonMode && nextChapterSlug) {
      goToNextChapter();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
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

  const renderVerticalReader = () => {
    return (
      <div 
        className="vertical-reader pt-16" 
        style={{ backgroundColor, maxWidth: '800px', margin: '0 auto' }}
        ref={readingContainerRef}
      >
        {comicPages.map((page, index) => (
          <div 
            key={index} 
            className="page-container comic-page"
            style={{ marginBottom: `${pageGap}px` }}
          >
            <img 
              src={page.url} 
              alt={`Page ${index + 1}`} 
              className="w-full rounded-md shadow-lg"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Found';
              }}
            />
          </div>
        ))}
        
        {/* End of chapter notification for vertical mode */}
        {isMarathonMode && nextChapterSlug && (
          <div className="py-8 text-center">
            <p className="text-white mb-4">End of chapter</p>
            {showNextChapterNotification && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-block"
              >
                <div className="bg-primary text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 animate-pulse">
                  <FaRunning />
                  <span>Loading next chapter...</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSinglePageReader = () => {
    if (comicPages.length === 0) return null;
    
    return (
      <div 
        className="single-page-reader flex flex-col items-center justify-center min-h-screen pt-16"
        style={{ backgroundColor }}
        ref={readingContainerRef}
      >
        <div className="w-full max-w-3xl mx-auto px-4">
          <img 
            src={comicPages[currentPage].url} 
            alt={`Page ${currentPage + 1}`}
            className="mx-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Found';
            }}
          />
          
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={navigateToPreviousPage}
              disabled={currentPage === 0}
              className={`p-3 rounded-full ${currentPage === 0 ? 'bg-gray-800/30 text-gray-600' : 'bg-gray-800/70 text-white hover:bg-primary'} transition-colors`}
            >
              <FaArrowLeft />
            </button>
            
            <div className="text-white text-sm">
              Page {currentPage + 1} of {comicPages.length}
            </div>
            
            <button
              onClick={navigateToNextPage}
              disabled={currentPage === comicPages.length - 1 && !nextChapterSlug}
              className={`p-3 rounded-full ${currentPage === comicPages.length - 1 && !nextChapterSlug ? 'bg-gray-800/30 text-gray-600' : 'bg-gray-800/70 text-white hover:bg-primary'} transition-colors`}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWebtoonReader = () => {
    return (
      <div 
        className="webtoon-reader pt-16" 
        style={{ backgroundColor }}
        ref={readingContainerRef}
      >
        <div className="max-w-3xl mx-auto px-4">
          {comicPages.map((page, index) => (
            <div 
              key={index} 
              className="comic-page"
              style={{ marginBottom: `${pageGap}px` }}
            >
              <img 
                src={page.url} 
                alt={`Page ${index + 1}`} 
                className="w-full rounded-md shadow-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Found';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading comic pages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <div className="container-custom py-8">
          <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-zinc-300 mb-6">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-page min-h-screen" style={{ backgroundColor }}>
      {/* Reading controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent z-50 p-4"
          >
            <div className="container-custom">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
                >
                  <FaArrowLeft className="text-white" />
                  <span className="text-white font-medium hidden sm:inline">Back</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/')}
                    className="p-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors backdrop-blur-sm border border-zinc-700/50"
                    title="Home"
                  >
                    <FaHome className="text-white" />
                  </button>
                  
                  <button
                    onClick={toggleMarathonMode}
                    className={`p-3 rounded-lg transition-colors backdrop-blur-sm border ${
                      isMarathonMode 
                        ? 'bg-secondary/80 hover:bg-secondary text-white border-secondary/50' 
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-white border-zinc-700/50'
                    }`}
                    title={isMarathonMode ? "Disable Marathon Mode" : "Enable Marathon Mode"}
                  >
                    <FaRunning className={isMarathonMode ? "text-white" : "text-white"} />
                  </button>
                  
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors backdrop-blur-sm border border-zinc-700/50"
                    title="Settings"
                  >
                    <FaCog className="text-white" />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors backdrop-blur-sm border border-zinc-700/50"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <FaCompress className="text-white" /> : <FaExpand className="text-white" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Marathon mode indicator */}
      {isMarathonMode && (
        <div className="fixed top-16 right-4 z-40">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 shadow-lg"
          >
            <FaRunning size={12} />
            Marathon Mode
          </motion.div>
        </div>
      )}

      {/* Reader based on mode */}
      {readingMode === 'vertical' && renderVerticalReader()}
      {readingMode === 'single' && renderSinglePageReader()}
      {readingMode === 'webtoon' && renderWebtoonReader()}

      {/* Settings dialog */}
      <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-sm w-[90vw] bg-zinc-900 rounded-xl p-6 shadow-xl z-50 border border-zinc-800">
            <Dialog.Title className="text-xl font-bold text-white mb-4">
              Reader Settings
            </Dialog.Title>
            
            <div className="space-y-6">
              <div>
                <label className="block text-zinc-300 font-medium mb-2">Reading Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setReadingMode('vertical')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      readingMode === 'vertical' 
                        ? 'bg-primary text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setReadingMode('single')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      readingMode === 'single' 
                        ? 'bg-primary text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    Single Page
                  </button>
                  <button
                    onClick={() => setReadingMode('webtoon')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      readingMode === 'webtoon' 
                        ? 'bg-primary text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    Webtoon
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-zinc-300 font-medium mb-2">Background Color</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setBackgroundColor('#000000')}
                    className={`h-10 rounded-lg transition-all duration-200 ${
                      backgroundColor === '#000000' ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: '#000000' }}
                  />
                  <button
                    onClick={() => setBackgroundColor('#1a1a1a')}
                    className={`h-10 rounded-lg transition-all duration-200 ${
                      backgroundColor === '#1a1a1a' ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: '#1a1a1a' }}
                  />
                  <button
                    onClick={() => setBackgroundColor('#2d2d2d')}
                    className={`h-10 rounded-lg transition-all duration-200 ${
                      backgroundColor === '#2d2d2d' ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: '#2d2d2d' }}
                  />
                  <button
                    onClick={() => setBackgroundColor('#f5f5f5')}
                    className={`h-10 rounded-lg transition-all duration-200 ${
                      backgroundColor === '#f5f5f5' ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-zinc-300 font-medium mb-2">Page Gap: {pageGap}px</label>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={pageGap} 
                  onChange={(e) => setPageGap(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isMarathonMode} 
                    onChange={toggleMarathonMode}
                    className="w-4 h-4 accent-primary" 
                  />
                  <span>Marathon Mode</span>
                </label>
                <p className="text-xs text-zinc-500 mt-1">
                  Automatically proceed to the next chapter when you reach the end
                </p>
              </div>
              
              <Dialog.Close asChild>
                <button
                  className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
                >
                  Apply Settings
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ReadingPage;
