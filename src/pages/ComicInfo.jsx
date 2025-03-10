
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaBookmark, FaRegBookmark, FaStar, FaPlay, 
  FaList, FaShare, FaBook, FaClock, FaRegCalendarAlt, 
  FaInfoCircle, FaTags, FaChevronDown, FaChevronUp, FaRunning
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import * as Tabs from '@radix-ui/react-tabs';
import * as Separator from '@radix-ui/react-separator';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
      // Use the Comic API to fetch the comic info
      const comicInstance = new Comic(slug);
      const comicData = await comicInstance.info();
      
      if (!comicData || !comicData.title) {
        throw new Error('Failed to fetch comic information');
      }
      
      setComic(comicData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching comic:', err);
      setError('Failed to load comic information. Please try again later.');
      setIsLoading(false);
      
      // Fallback to sample data for development/demo
      setTimeout(() => {
        const sampleComic = {
          id: 1,
          slug: slug,
          title: 'One Piece',
          cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
          synopsis: 'Gol D. Roger, a man referred to as the "Pirate King," is set to be executed by the World Government. But just before his death, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the Pirate King is executed and the Great Age of Pirates begins.\n\nTwenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new Pirate King. Armed with just a straw hat, a small boat, and an elastic body, he sets out on a fantastic journey to gather a crew and a ship worthy of a king.',
          author: 'Eiichiro Oda',
          artist: 'Eiichiro Oda',
          released: '1997',
          status: 'Ongoing',
          type: 'Manga',
          score: '9.8',
          genres: ['Action', 'Adventure', 'Fantasy', 'Shounen', 'Comedy', 'Drama'],
          chapters: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            slug: `${slug}-chapter-${1000 + i}`,
            title: `Chapter ${1000 + i}: The Grand Adventure`,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()
          })),
        };
        setComic(sampleComic);
        setIsLoading(false);
        setError(null);
      }, 1000);
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
    } else {
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

  const startMarathonMode = (startChapterIndex = 0) => {
    if (comic && comic.chapters && comic.chapters.length > 0) {
      // Store marathon mode state in localStorage
      localStorage.setItem('marathonMode', 'true');
      navigate(`/read/${comic.chapters[startChapterIndex].slug}`);
    }
  };

  const showImagePreview = (imgSrc) => {
    setSelectedImage(imgSrc);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const truncateSynopsis = (text, maxLength = 300) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
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
    <div className="min-h-screen bg-black pt-16">
      {/* Back button with improved styling */}
      <div className="container-custom pt-4">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50 shadow-md mb-4"
        >
          <FaArrowLeft className="text-primary group-hover:translate-x-[-3px] transition-transform" />
          <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">Back</span>
        </button>
      </div>
      
      <div className="container-custom pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Hero section with cover image */}
          <div className="relative w-full rounded-xl overflow-hidden mb-6 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>
            {comic.cover && (
              <img 
                src={comic.cover}
                alt={comic.title}
                className="w-full h-64 md:h-80 object-cover object-center blur-sm opacity-50"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/1200x400?text=No+Cover+Image';
                }}
              />
            )}
            
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-shadow">
                {comic.title}
              </h1>
            </div>
          </div>
          
          {/* Content grid - Info card and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Cover image card */}
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50 bg-gradient-to-b from-zinc-800 to-zinc-900 mx-auto md:mx-0"
                style={{ maxWidth: '280px' }}
                onClick={() => showImagePreview(comic.cover)}
              >
                <AspectRatio.Root ratio={2/3}>
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
                </AspectRatio.Root>
              </motion.div>
                
              {/* Actions under cover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col gap-3 mt-4 max-w-[280px] mx-auto md:mx-0"
              >
                {/* Bookmark button */}
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium w-full transition-all duration-300 ${
                    isBookmarked ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {isBookmarked ? <FaBookmark className="text-yellow-400" /> : <FaRegBookmark />}
                  {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                </button>
                
                {/* Share button */}
                <button
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all duration-300 border border-zinc-700 w-full"
                >
                  <FaShare />
                  Share
                </button>
              </motion.div>
            </div>
            
            {/* Right column - Comic details */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Tabs.Root defaultValue="info" className="w-full">
                  <Tabs.List className="flex mb-4 p-1 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800/50">
                    <Tabs.Trigger 
                      value="info" 
                      className="flex-1 py-2.5 px-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-400 transition-all duration-200 font-medium"
                    >
                      Information
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                      value="chapters" 
                      className="flex-1 py-2.5 px-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-400 transition-all duration-200 font-medium"
                    >
                      Chapters
                    </Tabs.Trigger>
                  </Tabs.List>
                
                  <Tabs.Content value="info" className="focus:outline-none">
                    <div className="glass-card p-6 rounded-xl comic-info-border">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div className="mb-4 md:mb-0">
                          <h2 className="text-2xl md:text-3xl font-bold text-white">{comic.title}</h2>
                          
                          {/* Status badges */}
                          <div className="flex flex-wrap gap-2 mt-2">
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
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Rating display */}
                          <div className="flex flex-col items-center bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-700/50">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <FaStar />
                              <span className="text-white font-bold">{comic.score || 'N/A'}</span>
                            </div>
                            <span className="text-xs text-zinc-400">Rating</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator.Root className="h-px bg-zinc-800 my-4" />
                      
                      {/* Comic metadata in grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
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
                        
                        {/* Marathon mode toggle button */}
                        {comic.chapters && comic.chapters.length > 0 && (
                          <button
                            onClick={() => startMarathonMode(0)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondary-dark rounded-xl text-white font-medium shadow-lg hover:shadow-secondary/40 transform hover:-translate-y-1 transition-all duration-300 marathon-button"
                          >
                            <FaRunning />
                            Marathon Mode
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Synopsis with Read More functionality */}
                    {comic.synopsis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 mt-6 backdrop-blur-sm"
                      >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                          <FaInfoCircle className="mr-2 text-primary" />
                          Synopsis
                        </h2>
                        <div className="space-y-4">
                          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                            {showFullSynopsis ? comic.synopsis : truncateSynopsis(comic.synopsis)}
                          </p>
                          {comic.synopsis && comic.synopsis.length > 300 && (
                            <button
                              onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                              className="text-primary hover:text-primary-light transition-colors flex items-center gap-1"
                            >
                              {showFullSynopsis ? (
                                <>
                                  Show Less <FaChevronUp className="text-xs" />
                                </>
                              ) : (
                                <>
                                  Read More <FaChevronDown className="text-xs" />
                                </>
                              )}
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
                        className="mt-6"
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
                              {typeof genre === 'string' ? genre : genre.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </Tabs.Content>
                  
                  <Tabs.Content value="chapters" className="focus:outline-none" ref={chaptersRef}>
                    {/* Chapters list */}
                    {comic.chapters && comic.chapters.length > 0 ? (
                      <Collapsible.Root
                        open={chaptersExpanded}
                        onOpenChange={setChaptersExpanded}
                        className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden backdrop-blur-sm"
                      >
                        <div className="p-4 md:p-6 border-b border-zinc-800/50 flex items-center justify-between">
                          <h2 className="text-xl font-bold text-white flex items-center">
                            <FaList className="mr-2 text-primary" />
                            Chapters
                          </h2>
                          <Collapsible.Trigger asChild>
                            <button
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-2 rounded-lg transition-colors"
                            >
                              {chaptersExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          </Collapsible.Trigger>
                        </div>
                        
                        <Collapsible.Content>
                          <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                            <div className="divide-y divide-zinc-800/50">
                              {comic.chapters.map((chapter, index) => (
                                <div 
                                  key={chapter.id || index}
                                  className="chapter-hover-effect p-4 hover:bg-zinc-800/30 transition-all duration-300"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <button
                                        onClick={() => navigate(`/read/${chapter.slug}`)}
                                        className="text-zinc-200 hover:text-white font-medium text-left transition-colors"
                                      >
                                        {chapter.title}
                                      </button>
                                      <div className="text-xs text-zinc-500 mt-1">
                                        Released: {chapter.date || chapter.released || 'Unknown'}
                                      </div>
                                    </div>
                                    {/* Chapter marathon button */}
                                    <button
                                      onClick={() => startMarathonMode(index)}
                                      className="p-2 rounded-lg bg-zinc-800 hover:bg-secondary-dark text-zinc-400 hover:text-white transition-colors"
                                      title="Start Marathon from this chapter"
                                    >
                                      <FaRunning />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    ) : (
                      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 text-center">
                        <p className="text-zinc-400">No chapters found for this comic.</p>
                      </div>
                    )}
                  </Tabs.Content>
                </Tabs.Root>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Image preview modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImagePreview}>
          <button 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            onClick={closeImagePreview}
          >
            <FaArrowLeft />
          </button>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={selectedImage} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ComicInfo;
