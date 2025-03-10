
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaArrowRight, FaCog, FaExpand, FaCompress, 
  FaTimes, FaHome, FaPalette, FaRunning, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comicPages, setComicPages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState(localStorage.getItem('readingMode') || 'vertical');
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem('backgroundColor') || '#000000');
  const [pageGap, setPageGap] = useState(parseInt(localStorage.getItem('pageGap') || '20'));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const readingContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [currentComicInfo, setCurrentComicInfo] = useState(null);
  const [nextChapterSlug, setNextChapterSlug] = useState(null);
  const [isMarathonMode, setIsMarathonMode] = useState(false);
  const [showNextChapterNotification, setShowNextChapterNotification] = useState(false);
  const lastScrollPositionRef = useRef(0);
  const scrollTimerRef = useRef(null);

  // Function to check if user has scrolled to bottom for marathon mode
  const handleScroll = useCallback(() => {
    if (!isMarathonMode || !nextChapterSlug) return;
    
    const currentScrollPosition = window.scrollY;
    const scrollDirection = currentScrollPosition > lastScrollPositionRef.current ? 'down' : 'up';
    lastScrollPositionRef.current = currentScrollPosition;
    
    // Clear existing timer to avoid multiple triggers
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // Only proceed for downward scrolls
    if (scrollDirection === 'down') {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + windowHeight;
      
      // If we've scrolled to the bottom (with a small buffer)
      if (scrollPosition >= documentHeight - 50) {
        scrollTimerRef.current = setTimeout(() => {
          setShowNextChapterNotification(true);
          
          // Wait a moment to show loading notification, then navigate
          setTimeout(() => {
            goToNextChapter();
          }, 800);
        }, 300);
      }
    }
  }, [isMarathonMode, nextChapterSlug]);

  useEffect(() => {
    // Add scroll event listener for marathon mode
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    // Check if we're in marathon mode 
    const marathonMode = localStorage.getItem('marathonMode') === 'true';
    setIsMarathonMode(marathonMode);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    // Initialize fullscreen change listener
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Load comic pages
    fetchComicPages();

    // Hide controls after 3 seconds
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [slug]);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('pageGap', pageGap.toString());
  }, [readingMode, backgroundColor, pageGap]);

  const fetchComicPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const comicInstance = new Comic(slug);
      const pages = await comicInstance.read();
      
      if (pages && pages.length > 0) {
        setComicPages(pages);
      } else {
        setError('No images found for this chapter.');
      }
      
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

  const goToNextChapter = () => {
    if (nextChapterSlug) {
      // Preserve marathon mode when changing chapters
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
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const toggleMarathonMode = () => {
    const newMarathonMode = !isMarathonMode;
    setIsMarathonMode(newMarathonMode);
    localStorage.setItem('marathonMode', newMarathonMode ? 'true' : 'false');
  };

  const returnToComic = () => {
    // Extract comic slug from chapter
    if (slug.includes('-chapter-')) {
      const comicSlug = slug.split('-chapter-')[0];
      navigate(`/info/${comicSlug}`);
    } else {
      navigate('/');
    }
  };

  const handleRetry = () => {
    fetchComicPages();
  };

  const renderSinglePageReader = () => (
    <div 
      className="min-h-screen flex flex-col items-center justify-center pt-14" 
      style={{ backgroundColor: backgroundColor }}
      ref={readingContainerRef}
    >
      {comicPages.length > 0 && (
        <motion.img
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={comicPages[currentPage].url}
          alt={`Page ${currentPage + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-md shadow-lg"
          loading="eager"
        />
      )}
      
      {/* Navigation buttons */}
      <div className="w-full flex justify-between px-4 my-4">
        <button
          onClick={navigateToPreviousPage}
          disabled={currentPage === 0}
          className={`p-3 rounded-full ${
            currentPage === 0 
              ? 'text-zinc-600 bg-zinc-800/50' 
              : 'text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80'
          } transition-colors`}
        >
          <FaArrowLeft />
        </button>
        
        <button
          onClick={navigateToNextPage}
          disabled={currentPage === comicPages.length - 1}
          className={`p-3 rounded-full ${
            currentPage === comicPages.length - 1 
              ? 'text-zinc-600 bg-zinc-800/50' 
              : 'text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80'
          } transition-colors`}
        >
          <FaArrowRight />
        </button>
      </div>
      
      {/* Page indicator */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentPage + 1} / {comicPages.length}
        </div>
      </div>
      
      {/* Show next chapter button at the end if in marathon mode */}
      {isMarathonMode && nextChapterSlug && currentPage === comicPages.length - 1 && (
        <div className="py-12 flex justify-center items-center flex-col">
          <div className="text-white text-opacity-60 text-sm mb-3">
            End of chapter
          </div>
          <div className="w-16 h-1 bg-primary rounded-full mb-6 animate-pulse"></div>
          <button 
            onClick={goToNextChapter}
            className="bg-secondary hover:bg-secondary-dark text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <FaRunning />
            Continue to Next Chapter
          </button>
        </div>
      )}
    </div>
  );

  const renderVerticalReader = () => (
    <ScrollArea.Root className="h-screen w-full overflow-hidden">
      <ScrollArea.Viewport
        className="w-full h-full pt-14 pb-10"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="max-w-3xl mx-auto px-2 sm:px-4" ref={readingContainerRef}>
          {comicPages.map((page, index) => (
            <div
              key={index}
              className="mb-4 w-full flex justify-center"
              style={{ marginBottom: `${pageGap}px` }}
            >
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index < 5 ? index * 0.1 : 0 }}
                src={page.url}
                alt={`Page ${index + 1}`}
                className="max-w-full rounded-md shadow-lg"
                loading={index < 10 ? "eager" : "lazy"}
              />
            </div>
          ))}
          
          {isMarathonMode && nextChapterSlug && (
            <div className="py-12 flex justify-center items-center flex-col">
              <div className="text-white text-opacity-60 text-sm mb-3">
                End of chapter
              </div>
              <div className="w-16 h-1 bg-primary rounded-full mb-6 animate-pulse"></div>
              <div className="text-white text-sm mb-4">
                {showNextChapterNotification ?
                  "Loading next chapter..." :
                  "Scroll to continue to next chapter"
                }
              </div>
              <button 
                onClick={goToNextChapter}
                className="bg-secondary hover:bg-secondary-dark text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <FaRunning />
                Continue to Next Chapter
              </button>
            </div>
          )}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" className="w-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full">
        <ScrollArea.Thumb className="bg-zinc-500/50 hover:bg-zinc-400/50 rounded-full" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading comic..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container-custom pt-20 py-8">
          <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-zinc-300 mb-6">{error}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={handleRetry}
                className="bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={returnToComic}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Back to Comic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" onMouseMove={handleMouseMove}>
      {/* Reading content */}
      {readingMode === 'single' ? renderSinglePageReader() : renderVerticalReader()}

      {/* Header Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-3 z-50 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={returnToComic}
                className="p-2 text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 rounded-lg transition-colors"
              >
                <FaArrowLeft />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="p-2 text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 rounded-lg transition-colors"
              >
                <FaHome />
              </button>
              
              {/* Comic title if available */}
              {currentComicInfo && (
                <div className="text-white font-medium ml-2 hidden md:block">
                  {currentComicInfo.title}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Marathon mode toggle */}
              <button
                onClick={toggleMarathonMode}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                  isMarathonMode 
                    ? 'bg-secondary/30 text-secondary-light border border-secondary/30' 
                    : 'bg-zinc-800/70 text-zinc-300 border border-zinc-700/50'
                }`}
              >
                <FaRunning size={14} />
                {isMarathonMode ? <FaToggleOn /> : <FaToggleOff />}
              </button>

              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 text-zinc-300 hover:text-white"
              >
                <FaCog />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-zinc-300 hover:text-white"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Dialog */}
      <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-[90%] max-w-md z-50 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold text-white">Reading Settings</Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-zinc-400 hover:text-white p-1 rounded-full">
                  <FaTimes />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-6">
              {/* Reading Mode */}
              <div>
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <FaBook className="mr-2 text-primary" />
                  Reading Mode
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReadingMode('vertical')}
                    className={`px-4 py-2 rounded-lg flex-1 ${
                      readingMode === 'vertical' 
                        ? 'bg-primary text-white' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    } transition-colors`}
                  >
                    Vertical Scroll
                  </button>
                  <button
                    onClick={() => setReadingMode('single')}
                    className={`px-4 py-2 rounded-lg flex-1 ${
                      readingMode === 'single' 
                        ? 'bg-primary text-white' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    } transition-colors`}
                  >
                    Single Page
                  </button>
                </div>
              </div>

              {/* Background Color */}
              <div>
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <FaPalette className="mr-2 text-primary" />
                  Background Color
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['#000000', '#121212', '#1a1a1a', '#242424', '#0a0a15', '#0a150a', '#150a0a', '#f5f5f5'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-full h-10 rounded-lg ${
                        backgroundColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set background color to ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Page Gap (only for vertical mode) */}
              {readingMode === 'vertical' && (
                <div>
                  <h3 className="text-white font-medium mb-2">Page Gap</h3>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={pageGap}
                      onChange={(e) => setPageGap(parseInt(e.target.value))}
                      className="w-full accent-primary bg-zinc-800 h-2 rounded-full"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 mt-1">
                      <span>No gap</span>
                      <span>{pageGap}px</span>
                      <span>Maximum</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Marathon Mode Toggle */}
              <div>
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <FaRunning className="mr-2 text-secondary" />
                  Marathon Mode
                </h3>
                <button
                  onClick={toggleMarathonMode}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                    isMarathonMode 
                      ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                  } transition-colors`}
                >
                  {isMarathonMode ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                  {isMarathonMode ? 'Enabled' : 'Disabled'}
                </button>
                <p className="text-xs text-zinc-400 mt-2">
                  When enabled, automatically continue to the next chapter when you reach the end.
                </p>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ReadingPage;
