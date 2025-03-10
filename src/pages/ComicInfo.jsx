import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBookmark, FaChevronLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import * as Separator from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ComicInfo = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comicInfo = await Comic.getInfo(id);
        setComic(comicInfo);

        const comicChapters = await Comic.getChapters(id);
        setChapters(comicChapters);
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComicInfo();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-400" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
          Comic not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-10">
      {/* Back button */}
      <div className="container-custom pt-4">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4">
          <FaChevronLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Comic banner/cover */}
      <div className="relative h-60 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={comic.coverImage} 
          alt={comic.title} 
          className="w-full h-full object-cover object-center blur-sm opacity-30"
        />
      </div>

      {/* Comic info */}
      <div className="container-custom -mt-24 relative z-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover image */}
          <div className="w-40 md:w-56 flex-shrink-0">
            <img 
              src={comic.coverImage} 
              alt={comic.title} 
              className="w-full rounded-lg shadow-lg border border-zinc-800"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {comic.type && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100">
                  {comic.type}
                </span>
              )}
              {comic.status && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100">
                  {comic.status}
                </span>
              )}
              {comic.score && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/60 text-yellow-100">
                  ★ {comic.score}
                </span>
              )}
            </div>

            <div className="text-zinc-400 mb-4">
              {comic.author && <p><strong>Author:</strong> {comic.author}</p>}
              {comic.genres && (
                <div className="mt-2">
                  <strong>Genres:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {comic.genres.map((genre, index) => (
                      <span key={index} className="bg-zinc-800 px-2 py-1 text-xs rounded-full text-zinc-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaBookmark />
              <span>Add to Favorites</span>
            </button>
          </div>
        </div>

        {/* Synopsis */}
        {comic.description && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Synopsis</h2>
            <p className="text-zinc-400 leading-relaxed">{comic.description}</p>
          </div>
        )}

        <Separator.Root className="h-px w-full bg-zinc-800 my-6" />

        {/* Chapters */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Chapters</h2>

          {chapters.length === 0 ? (
            <p className="text-zinc-400">No chapters available.</p>
          ) : (
            <ScrollArea.Root className="w-full h-[400px]">
              <ScrollArea.Viewport className="w-full h-full">
                <div className="space-y-1">
                  {chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      to={`/read/${id}/${chapter.id}`}
                      className="block p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">Chapter {chapter.number || index + 1}</span>
                        <span className="text-zinc-500 text-sm">{chapter.updatedAt}</span>
                      </div>
                      {chapter.title && (
                        <p className="text-zinc-400 text-sm mt-1">{chapter.title}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar 
                className="flex select-none touch-none p-0.5 bg-zinc-800 transition-colors duration-150 ease-out hover:bg-zinc-700 w-2.5 rounded-full"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="flex-1 bg-zinc-500 rounded-full relative" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaExclamationTriangle, FaSpinner, FaClock, FaBookOpen } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comicApi = new Comic();
        const comicInfo = await comicApi.getInfo(id);
        setComic(comicInfo);

        const comicChapters = await comicApi.getChapters(id);
        setChapters(comicChapters);

        // Check if comic is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.some(bookmark => bookmark.id === id));
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComicInfo();
    }
  }, [id]);

  const toggleBookmark = () => {
    if (!comic) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isCurrentlyBookmarked = bookmarks.some(bookmark => bookmark.id === id);
    
    if (isCurrentlyBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const { title, cover, type, status, score } = comic;
      const newBookmark = { id, title, cover, type, status, score, timestamp: Date.now() };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setIsBookmarked(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-lg flex flex-col items-center gap-3">
          <FaExclamationTriangle className="text-red-400 text-4xl mb-2" />
          <p className="text-center text-lg">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-gray-900/50 text-gray-200 p-6 rounded-lg flex items-center justify-center">
          <p>No comic information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      {/* Cover background */}
      <div className="relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${comic.cover})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: '0.3'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-gray-900" />
        
        <div className="container-custom relative z-10 h-full flex items-end pb-6">
          <Link to="/" className="absolute top-4 left-4 text-white">
            <motion.div 
              whileHover={{ x: -3 }}
              className="flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="container-custom -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-40 md:w-56 flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800/50">
              <img 
                src={comic.cover || 'https://via.placeholder.com/300x450?text=No+Image'} 
                alt={comic.title} 
                className="w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=Error+Loading';
                }}
              />
              <button 
                onClick={toggleBookmark}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 rounded-full text-white hover:bg-black transition-colors"
              >
                {isBookmarked ? <FaBookmark className="text-yellow-400" /> : <FaRegBookmark />}
              </button>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{comic.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {comic.type && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100 flex items-center">
                  <FaBookOpen className="mr-1" /> {comic.type}
                </span>
              )}
              {comic.status && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100 flex items-center">
                  <FaClock className="mr-1" /> {comic.status}
                </span>
              )}
              {comic.score && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/60 text-yellow-100 flex items-center">
                  <FaSpinner className="mr-1" /> {comic.score}
                </span>
              )}
            </div>

            <div className="text-zinc-300 mb-6">
              {comic.author && (
                <p className="mb-2">
                  <strong className="text-white">Author:</strong> {comic.author}
                </p>
              )}
              
              {comic.genres && comic.genres.length > 0 && (
                <div className="mt-3">
                  <strong className="text-white">Genres:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {comic.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-800/80 border border-gray-700/30 px-3 py-1 text-xs rounded-full text-gray-200 hover:bg-gray-700/80 transition-colors"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {comic.description && (
                <div className="mt-4">
                  <strong className="text-white">Description:</strong>
                  <p className="mt-2 text-zinc-300 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {comic.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaBookOpen className="mr-2" /> Chapters
          </h2>
          
          {chapters.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center text-gray-300">
              No chapters available for this title.
            </div>
          ) : (
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg overflow-hidden">
              {chapters.map((chapter, index) => (
                <Link 
                  key={chapter.id || index}
                  to={`/read/${id}/${chapter.id}`}
                  className="block"
                >
                  <motion.div 
                    whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                    className="border-b border-gray-700/30 last:border-b-0 p-4 flex justify-between items-center hover:bg-gray-700/20 transition-colors"
                  >
                    <div>
                      <span className="text-gray-200 font-medium">
                        {chapter.title || `Chapter ${chapter.number || index + 1}`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {chapter.date || 'N/A'}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ComicInfo;o;