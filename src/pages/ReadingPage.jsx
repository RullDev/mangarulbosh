import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaCog, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Dialog from '@radix-ui/react-dialog';

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
      } catch (err) {
        console.error('Error fetching comic pages:', err);
        setError('Failed to load comic pages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComicPages();

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
    };
  }, [slug]);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('pageGap', pageGap.toString());
  }, [readingMode, backgroundColor, pageGap]);

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
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

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
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-900/50 transition-colors duration-150 ease-out hover:bg-zinc-800/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-700 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );

  const renderSinglePageReader = () => (
    <div 
      className="h-screen w-full flex items-center justify-center px-4 pt-14 pb-14" 
      style={{ backgroundColor: backgroundColor }}
      ref={readingContainerRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-full max-h-[85vh] flex justify-center items-center"
        >
          {comicPages[currentPage] && (
            <img
              src={comicPages[currentPage].url}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Page navigation arrows for single mode */}
      <AnimatePresence>
        {showControls && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={navigateToPreviousPage}
              disabled={currentPage === 0}
              className={`absolute left-4 p-3 rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70'}`}
            >
              <FaChevronLeft />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onClick={navigateToNextPage}
              disabled={currentPage === comicPages.length - 1}
              className={`absolute right-4 p-3 rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity ${currentPage === comicPages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/70'}`}
            >
              <FaChevronRight />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Page indicator */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentPage + 1} / {comicPages.length}
        </div>
      </div>
    </div>
  );

  const renderWebtoonReader = () => (
    <ScrollArea.Root className="h-screen w-full overflow-hidden">
      <ScrollArea.Viewport 
        className="w-full h-full pt-14 pb-10" 
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="max-w-3xl mx-auto px-0" ref={readingContainerRef}>
          {comicPages.map((page, index) => (
            <motion.img
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index < 5 ? index * 0.1 : 0 }}
              src={page.url}
              alt={`Page ${index + 1}`}
              className="w-full"
              loading={index < 10 ? "eager" : "lazy"}
            />
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-900/50 transition-colors duration-150 ease-out hover:bg-zinc-800/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-700 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" message="Loading comic pages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Comic</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            <FaHome className="mr-2" /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Top controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-between px-4 py-2"
          >
            <Link to={`/comic/${slug.split('-chapter-')[0]}`} className="flex items-center text-zinc-300 hover:text-white">
              <FaArrowLeft className="mr-2" /> Back
            </Link>

            <div className="flex items-center gap-4">
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
                <label className="block text-zinc-300 mb-2">Reading Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setReadingMode('vertical')}
                    className={`p-2 rounded text-center text-sm ${readingMode === 'vertical' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-300'}`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setReadingMode('single')}
                    className={`p-2 rounded text-center text-sm ${readingMode === 'single' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-300'}`}
                  >
                    Single (Beta)
                  </button>
                  <button
                    onClick={() => setReadingMode('webtoon')}
                    className={`p-2 rounded text-center text-sm ${readingMode === 'webtoon' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-300'}`}
                  >
                    Webtoon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-2">Background Color</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setBackgroundColor('#000000')}
                    className={`h-8 rounded-xl ${backgroundColor === '#000000' ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-900' : ''}`}
                    style={{ backgroundColor: '#000000' }}
                  ></button>
                  <button
                    onClick={() => setBackgroundColor('#121212')}
                    className={`h-8 rounded-xl ${backgroundColor === '#121212' ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-900' : ''}`}
                    style={{ backgroundColor: '#121212' }}
                  ></button>
                  <button
                    onClick={() => setBackgroundColor('#1a1a1a')}
                    className={`h-8 rounded-xl ${backgroundColor === '#1a1a1a' ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-900' : ''}`}
                    style={{ backgroundColor: '#1a1a1a' }}
                  ></button>
                  <button
                    onClick={() => setBackgroundColor('#0adaff')}
                    className={`h-8 rounded-xl ${backgroundColor === '#0adaff' ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-900' : ''}`}
                    style={{ backgroundColor: '#0adaff' }}
                  ></button>
                </div>
              </div>

              {readingMode === 'vertical' && (
                <div>
                  <label className="block text-zinc-300 mb-2">Page Gap</label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={pageGap}
                    onChange={(e) => setPageGap(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>None</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
              )}
            </div>

            <Dialog.Close asChild>
              <button className="mt-6 w-full py-2 bg-primary text-white rounded-lg font-medium">
                Save Settings
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ReadingPage;