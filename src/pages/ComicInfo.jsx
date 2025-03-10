
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaList, FaRunning, FaArrowLeft, FaInfoCircle, 
  FaBookmark, FaRegBookmark, FaShare, FaStar, FaCalendarAlt,
  FaChevronUp, FaChevronDown, FaImage, FaTimes
} from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [marathonStartChapterIndex, setMarathonStartChapterIndex] = useState(0);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const chaptersRef = useRef(null);
  const [chaptersExpanded, setChaptersExpanded] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchComic();
    checkIfBookmarked();
  }, [slug]);

  const fetchComic = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const comicInstance = new Comic(slug);
      const result = await comicInstance.info();
      setComic(result);
    } catch (err) {
      console.error('Error fetching comic:', err);
      setError('Failed to load comic. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchComic();
  };

  const checkIfBookmarked = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.some(bookmark => bookmark.slug === slug));
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else if (comic) {
      const { id, title, cover, type, status, score } = comic;
      const newBookmark = { id, slug, title, cover, type, status, score, addedAt: new Date().toISOString() };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setIsBookmarked(true);
    }
  };

  const scrollToChapters = () => {
    if (chaptersRef.current) {
      chaptersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startMarathonMode = () => {
    if (comic && comic.chapters && comic.chapters.length > 0) {
      // Store marathon mode state in localStorage with improved structure
      localStorage.setItem('marathonMode', JSON.stringify({
        active: true,
        comicSlug: slug,
        comicTitle: comic.title,
        currentChapterIndex: marathonStartChapterIndex,
        totalChapters: comic.chapters.length,
        lastUpdated: new Date().toISOString()
      }));
      navigate(`/read/${comic.chapters[marathonStartChapterIndex].slug}`);
    }
  };

  const openImageViewer = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const truncateSynopsis = (text) => {
    if (text.length <= 300) return text;
    return text.substring(0, 300) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" message="Loading comic details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-zinc-900/80 rounded-xl p-6 max-w-md text-center border border-red-500/30">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-zinc-300 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary rounded-lg font-medium text-white hover:bg-primary/90 transition-all"
            >
              Try Again
            </button>
            <Link 
              to="/"
              className="px-4 py-2 bg-zinc-800 rounded-lg font-medium text-white hover:bg-zinc-700 transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-white mb-4">Comic not found</h2>
          <Link to="/" className="px-4 py-2 bg-primary rounded-lg text-white">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="pt-6 px-4 md:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-zinc-400 hover:text-white transition-colors group"
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mr-2 bg-zinc-800/80 p-2 rounded-full"
          >
            <FaArrowLeft />
          </motion.div>
          <span className="group-hover:underline">Back to Home</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero section with comic cover and basic info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden rounded-2xl"
          style={{
            backgroundImage: comic.cover ? `url(${comic.cover})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/30 backdrop-blur-sm z-0"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Left column - Comic cover */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative"
              >
                <img
                  src={comic.cover}
                  alt={comic.title}
                  className="w-full rounded-xl shadow-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                  onClick={() => openImageViewer(comic.cover)}
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-primary to-secondary p-2 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-1 text-white font-bold">
                    <FaStar className="text-yellow-300" />
                    {comic.score ? comic.score.toFixed(1) : 'N/A'}
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Actions buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col gap-3 mt-6"
              >
                {/* Bookmark button */}
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 w-full
                    ${isBookmarked 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}
                >
                  {isBookmarked ? <FaBookmark className="text-yellow-300" /> : <FaRegBookmark />}
                  {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                </button>
                
                {/* Share button */}
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all duration-300 border border-zinc-700 w-full"
                    >
                      <FaShare />
                      Share
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-xl shadow-xl z-50 w-[90vw] max-w-md animate-scale-in">
                      <Dialog.Title className="text-xl font-bold text-white mb-4">Share this comic</Dialog.Title>
                      <div className="mb-4">
                        <input 
                          type="text" 
                          value={window.location.href} 
                          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                          readOnly
                          onClick={(e) => e.target.select()}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Dialog.Close asChild>
                          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg">
                            Close
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </motion.div>
            </div>
            
            {/* Right column - Comic details */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="glass-card p-6 rounded-xl mb-6 comic-info-border"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 gradient-text inline-block">
                      {comic.title}
                    </h1>
                    
                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {comic.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                          ${comic.status.toLowerCase().includes('ongoing') 
                            ? 'bg-green-900/70 text-green-400 border border-green-500/30' 
                            : 'bg-blue-900/70 text-blue-400 border border-blue-500/30'}`}
                        >
                          {comic.status}
                        </span>
                      )}
                      
                      {comic.type && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900/70 text-purple-400 border border-purple-500/30">
                          {comic.type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Comic metadata */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {comic.author && (
                      <div className="col-span-1">
                        <div className="text-zinc-400 text-sm">Author</div>
                        <div className="text-white">{comic.author}</div>
                      </div>
                    )}
                    
                    {comic.status && (
                      <div className="col-span-1">
                        <div className="text-zinc-400 text-sm">Status</div>
                        <div className="text-white">{comic.status}</div>
                      </div>
                    )}
                    
                    {comic.released && (
                      <div className="col-span-1">
                        <div className="text-zinc-400 text-sm">Released</div>
                        <div className="text-white flex items-center">
                          <FaCalendarAlt className="mr-2 text-primary" />
                          {comic.released}
                        </div>
                      </div>
                    )}
                    
                    {comic.type && (
                      <div className="col-span-1">
                        <div className="text-zinc-400 text-sm">Type</div>
                        <div className="text-white">{comic.type}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {comic.chapters && comic.chapters.length > 0 && (
                      <motion.button
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/read/${comic.chapters[0].slug}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium shadow-lg transform transition-all duration-300"
                      >
                        <FaPlay />
                        Start Reading
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={scrollToChapters}
                      className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-medium transform transition-all duration-300"
                    >
                      <FaList />
                      View Chapters
                    </motion.button>
                    
                    {/* Marathon mode button */}
                    {comic.chapters && comic.chapters.length > 0 && (
                      <motion.button
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(246, 173, 85, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startMarathonMode}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondary-dark rounded-xl text-white font-medium shadow-lg transform transition-all duration-300 marathon-button relative overflow-hidden"
                      >
                        <FaRunning />
                        Marathon Mode
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Synopsis with Read More functionality */}
        {comic.synopsis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="glass-card rounded-xl p-6 mb-8 comic-info-border"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-primary" />
              Synopsis
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {showFullSynopsis ? comic.synopsis : truncateSynopsis(comic.synopsis)}
              </p>
              {comic.synopsis.length > 300 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                >
                  {showFullSynopsis ? 'Show Less' : 'Read More'}
                  {showFullSynopsis ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Genres */}
        {comic.genres && comic.genres.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="glass-card rounded-xl p-6 mb-8 comic-info-border"
          >
            <h2 className="text-xl font-bold text-white mb-4">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {comic.genres.map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  {genre}
                </span>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Chapters list */}
        {comic.chapters && comic.chapters.length > 0 && (
          <motion.div
            ref={chaptersRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="glass-card rounded-xl p-6 mb-8 comic-info-border"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaList className="mr-2 text-primary" />
                Chapters
              </h2>
              <button
                onClick={() => setChaptersExpanded(!chaptersExpanded)}
                className="text-zinc-400 hover:text-white"
              >
                {chaptersExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {/* Marathon mode starter selector */}
            {comic.chapters.length > 1 && (
              <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="text-zinc-300">Start Marathon from Chapter:</div>
                  <select
                    value={marathonStartChapterIndex}
                    onChange={(e) => setMarathonStartChapterIndex(Number(e.target.value))}
                    className="py-2 px-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 w-full md:max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {comic.chapters.map((chapter, index) => (
                      <option key={chapter.id} value={index}>
                        {chapter.title || `Chapter ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startMarathonMode}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                  >
                    <FaRunning />
                    Start Marathon
                  </motion.button>
                </div>
              </div>
            )}
            
            {chaptersExpanded && (
              <ScrollArea.Root className="max-h-96 overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full">
                  <ul className="space-y-1">
                    {comic.chapters.map((chapter, index) => (
                      <motion.li 
                        key={chapter.id}
                        whileHover={{ x: 8 }}
                        className="chapter-hover-effect rounded-lg overflow-hidden"
                      >
                        <Link
                          to={`/read/${chapter.slug}`}
                          className="flex justify-between items-center p-3 text-zinc-300 hover:text-white transition-colors"
                        >
                          <span>{chapter.title || `Chapter ${index + 1}`}</span>
                          <span className="text-zinc-500 text-sm">{chapter.date}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar 
                  className="flex select-none touch-none p-0.5 bg-zinc-800/50 transition-colors duration-150 ease-out hover:bg-zinc-700/50 rounded-full w-2.5"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-zinc-600 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            )}
          </motion.div>
        )}
        
        {/* Image gallery in Dialog */}
        {selectedImage && (
          <Dialog.Root open={!!selectedImage} onOpenChange={closeImageViewer}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 animate-fade-in" />
              <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
                <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Comic cover" 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                  <Dialog.Close asChild>
                    <button 
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                      aria-label="Close"
                    >
                      <FaTimes size={20} />
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>
    </div>
  );
};

export default ComicInfo;
