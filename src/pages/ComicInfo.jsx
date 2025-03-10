
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaStar, FaBookmark, FaRegBookmark, 
  FaHeart, FaRegHeart, FaBook, FaInfoCircle, 
  FaRegCalendarAlt, FaLanguage, FaClock, FaTags, 
  FaRunning, FaPlay, FaList, FaTimes, FaShare
} from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import * as Dialog from '@radix-ui/react-dialog';

const ComicInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('chapters');
  const [isMarathonModalOpen, setIsMarathonModalOpen] = useState(false);
  const [marathonStartChapterIndex, setMarathonStartChapterIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const chaptersRef = useRef(null);

  useEffect(() => {
    const checkIfFavorite = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.slug === id));
      } catch (err) {
        console.error("Error checking favorites:", err);
        setIsFavorite(false);
      }
    };

    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const comicInstance = new Comic(id);
        const results = await comicInstance.info();
        
        if (results && Object.keys(results).length > 0) {
          setComic(results);
        } else {
          throw new Error("Comic information not found");
        }
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkIfFavorite();
    fetchComicInfo();
  }, [id, retryCount]);

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(fav => fav.slug !== id);
      } else {
        const newFavorite = {
          slug: comic.slug,
          cover: comic.cover,
          title: comic.title,
          type: comic.type || 'Unknown',
          status: comic.status || 'Unknown',
          timestamp: Date.now()
        };
        newFavorites = [...favorites, newFavorite];
      }

      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const scrollToChapters = () => {
    if (chaptersRef.current) {
      chaptersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startMarathonMode = () => {
    if (comic && comic.chapters && comic.chapters.length > 0) {
      navigate(`/read/${comic.chapters[marathonStartChapterIndex].slug}`);
    }
  };

  const showImagePreview = (imgSrc) => {
    setSelectedImage(imgSrc);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading comic information..." />
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
              onClick={handleRetry}
              className="bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      <div className="container-custom">
        {/* Comic header with parallax effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Translucent header background with cover image */}
          <div className="absolute inset-0 w-full h-[50vh] overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/90 to-black"></div>
            <img 
              src={comic.cover} 
              alt="" 
              className="w-full h-full object-cover object-center opacity-30 blur-xl"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="pt-8">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary mb-6 transition-colors">
                <FaArrowLeft />
                <span>Back to Home</span>
              </Link>
            </motion.div>
            
            {/* Comic info card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl glass-card shadow-2xl mb-8 comic-info-border"
            >              
              {/* Decorative element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-800/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Comic cover */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50 bg-gradient-to-b from-zinc-800 to-zinc-900 min-w-[200px] max-w-[280px] mx-auto md:mx-0"
                  style={{ aspectRatio: '2/3' }}
                  onClick={() => showImagePreview(comic.cover)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <img 
                    src={comic.cover} 
                    alt={comic.title}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {comic.type || 'Unknown'}
                    </div>
                    <div className="flex gap-1 text-yellow-500">
                      <FaStar />
                      <span className="text-white text-xs">{comic.score || 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Comic details */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white">{comic.title}</h1>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={toggleFavorite}
                          className={`p-2 rounded-full transition-all duration-300 ${isFavorite ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-red-600/20 hover:text-red-400'}`}
                        >
                          {isFavorite ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                        </button>
                        
                        <button 
                          onClick={() => setIsMarathonModalOpen(true)}
                          className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition-colors"
                          title="Marathon Mode"
                        >
                          <FaRunning className="text-xl" />
                        </button>
                        
                        <button
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 p-2 rounded-full transition-colors"
                          title="Share"
                        >
                          <FaShare className="text-xl" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {comic.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          comic.status.toLowerCase() === 'ongoing' 
                            ? 'bg-green-600/30 text-green-400 border border-green-500/30' 
                            : 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
                        }`}>
                          {comic.status}
                        </span>
                      )}
                      
                      {comic.chapters && comic.chapters.length > 0 && (
                        <span className="bg-purple-600/30 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium">
                          {comic.chapters.length} Chapters
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                      {/* Comic metadata */}
                      {comic.author && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <FaBook className="text-primary" />
                          <span className="text-zinc-500">Author:</span>
                          <span className="text-zinc-300">{comic.author}</span>
                        </div>
                      )}
                      
                      {comic.status && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <FaClock className="text-primary" />
                          <span className="text-zinc-500">Status:</span>
                          <span className="text-zinc-300">{comic.status}</span>
                        </div>
                      )}
                      
                      {comic.released && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <FaRegCalendarAlt className="text-primary" />
                          <span className="text-zinc-500">Released:</span>
                          <span className="text-zinc-300">{comic.released}</span>
                        </div>
                      )}
                      
                      {comic.type && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <FaInfoCircle className="text-primary" />
                          <span className="text-zinc-500">Type:</span>
                          <span className="text-zinc-300">{comic.type}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                      {comic.chapters && comic.chapters.length > 0 && (
                        <button
                          onClick={() => navigate(`/read/${comic.chapters[0].slug}`)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300"
                        >
                          <FaPlay />
                          Start Reading
                        </button>
                      )}
                      
                      <button
                        onClick={scrollToChapters}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-medium transform hover:-translate-y-1 transition-all duration-300"
                      >
                        <FaList />
                        View Chapters
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Synopsis */}
            {comic.synopsis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaInfoCircle className="mr-2 text-primary" />
                  Synopsis
                </h2>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {comic.synopsis}
                </p>
              </motion.div>
            )}
            
            {/* Genres */}
            {comic.genres && comic.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaTags className="mr-2 text-primary" />
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {comic.genres.map((genre, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-300 rounded-full text-sm font-medium transition-colors cursor-pointer"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Chapters section */}
            {comic.chapters && comic.chapters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                ref={chaptersRef}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <div className="px-6 py-4 bg-zinc-900/70 border-b border-zinc-800/70">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FaList className="mr-2 text-primary" />
                      Chapters
                    </h2>
                    <div className="text-sm text-zinc-400">
                      {comic.chapters.length} chapters
                    </div>
                  </div>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                    {comic.chapters.map((chapter, index) => (
                      <div 
                        key={index}
                        className="group border-b border-zinc-800/30 last:border-0"
                      >
                        <Link 
                          to={`/read/${chapter.slug}`}
                          className="flex justify-between items-center py-4 px-4 hover:bg-zinc-800/30 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex-1">
                            <h3 className="text-zinc-300 group-hover:text-white transition-colors">
                              {chapter.title || `Chapter ${chapter.number}`}
                            </h3>
                            {chapter.releaseDate && (
                              <p className="text-zinc-500 text-sm">{chapter.releaseDate}</p>
                            )}
                          </div>
                          <div className="bg-zinc-800 group-hover:bg-primary text-zinc-300 group-hover:text-white px-3 py-1 rounded-lg text-sm transition-colors">
                            Read
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Marathon Mode Modal */}
      <Dialog.Root open={isMarathonModalOpen} onOpenChange={setIsMarathonModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-zinc-900 rounded-xl shadow-xl border border-zinc-700/50 p-6 z-50 max-h-[85vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold text-white">Marathon Mode</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
                    <FaTimes />
                  </button>
                </Dialog.Close>
              </div>
              
              <div className="mb-6">
                <p className="text-zinc-300 mb-4">
                  Marathon mode allows you to read multiple chapters in succession without returning to the comic info page.
                </p>
                
                <div className="mb-6">
                  <label htmlFor="startingChapter" className="block text-zinc-400 mb-2">
                    Start from:
                  </label>
                  <select
                    id="startingChapter"
                    value={marathonStartChapterIndex}
                    onChange={(e) => setMarathonStartChapterIndex(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {comic.chapters.map((chapter, index) => (
                      <option key={index} value={index}>
                        {chapter.title || `Chapter ${chapter.number}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={startMarathonMode}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium flex items-center justify-center gap-2"
                >
                  <FaRunning />
                  Start Marathon
                </button>
              </div>
              
              <div className="p-4 bg-zinc-800/50 rounded-lg text-zinc-400 text-sm">
                <p>
                  Tip: Press <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Space</kbd> during reading to navigate to the next chapter automatically.
                </p>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImagePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="relative max-w-3xl max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm"
                onClick={closeImagePreview}
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComicInfo;
