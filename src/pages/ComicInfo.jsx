
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookmark, FaRegBookmark, FaChevronDown, FaChevronUp, FaCalendarAlt, FaBookReader, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        setLoading(true);
        // This is a placeholder for the API call to fetch comic by slug
        // Simulating API call with setTimeout
        setTimeout(() => {
          // Mock data
          const comicData = {
            slug: slug,
            title: 'One Piece',
            cover: 'https://cdn.myanimelist.net/images/manga/3/265212.jpg',
            description: "Gol D. Roger, a man referred to as the 'King of the Pirates,' is set to be executed by the World Government. But just before his death, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the King of the Pirates is executed and the Great Age of Pirates begins. Twenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new King of the Pirates.",
            author: 'Eiichiro Oda',
            status: 'Ongoing',
            type: 'Manga',
            releaseDate: '1997',
            rating: 9.8,
            genres: ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Shounen', 'Super Power'],
            chapters: [
              { number: 1074, title: 'The Eyes that See the Future', date: '2023-02-05' },
              { number: 1073, title: 'The Moon', date: '2023-01-29' },
              { number: 1072, title: 'I'll Be Your Shield', date: '2023-01-22' },
              { number: 1071, title: 'The Strongest Human', date: '2023-01-15' },
              { number: 1070, title: 'Take Care of Vegapunk', date: '2023-01-08' },
              { number: 1069, title: 'Shockwave', date: '2022-12-25' },
              { number: 1068, title: 'Six Vegapunks', date: '2022-12-18' },
              { number: 1067, title: 'Punk Records', date: '2022-12-11' },
              { number: 1066, title: 'Do They Dream of Joining the Battle', date: '2022-12-04' },
              { number: 1065, title: 'Six Vegapunks', date: '2022-11-27' },
            ]
          };
          setComic(comicData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load comic details. Please try again later.');
        setLoading(false);
      }
    };

    // Check if comic is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const found = favorites.some(fav => fav.slug === slug);
    setIsFavorite(found);

    fetchComic();
  }, [slug]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.slug !== slug);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      const newFavorite = {
        slug: comic.slug,
        title: comic.title,
        cover: comic.cover,
        type: comic.type,
        rating: comic.rating
      };
      localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
      setIsFavorite(true);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading comic details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-zinc-900/70 backdrop-blur border border-zinc-800/50 rounded-xl">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-zinc-400 mb-4">{error}</p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-zinc-900/70 backdrop-blur border border-zinc-800/50 rounded-xl">
          <div className="text-red-500 text-xl mb-4">Comic Not Found</div>
          <p className="text-zinc-400 mb-4">The requested comic could not be found.</p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ScrollArea.Root className="h-screen overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full pt-20 pb-12 bg-black">
        <div className="container-custom py-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors bg-zinc-900/40 hover:bg-zinc-800/60 px-4 py-2 rounded-full">
              <FaArrowLeft />
              <span>Back to Home</span>
            </Link>
          </motion.div>
          
          {/* Comic info header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/50 mb-8 shadow-xl"
          >
            <div className="absolute inset-0 overflow-hidden opacity-15">
              <img 
                src={comic.cover} 
                alt={comic.title} 
                className="w-full h-full object-cover object-center blur-md scale-110"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            </div>
            
            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Comic cover */}
              <motion.div 
                className="w-48 md:w-56 flex-shrink-0 mx-auto md:mx-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-zinc-800/70 backdrop-blur p-2 rounded-lg shadow-lg border border-zinc-700/30 overflow-hidden">
                  <img 
                    src={comic.cover} 
                    alt={comic.title} 
                    className="w-full aspect-[2/3] object-cover object-center rounded"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Comic info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{comic.title}</h1>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-500/20' : 'text-zinc-400 bg-zinc-800/50 hover:bg-zinc-700/50'}`}
                  >
                    {isFavorite ? <FaBookmark className="text-xl" /> : <FaRegBookmark className="text-xl" />}
                  </motion.button>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-zinc-300 text-sm">
                    <span className="bg-zinc-800/70 px-3 py-1 rounded-full border border-zinc-700/30">
                      {comic.type}
                    </span>
                    <span className="bg-zinc-800/70 px-3 py-1 rounded-full border border-zinc-700/30">
                      {comic.status}
                    </span>
                    <div className="flex items-center gap-1 bg-zinc-800/70 px-3 py-1 rounded-full border border-zinc-700/30">
                      <FaStar className="text-yellow-500" />
                      <span>{comic.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {comic.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaBookReader className="text-primary" />
                    <span>Author: <span className="text-white">{comic.author}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <FaCalendarAlt className="text-primary" />
                    <span>Released: <span className="text-white">{comic.releaseDate}</span></span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <p className={`text-zinc-400 text-sm ${!expandedDescription && 'line-clamp-3'}`}>
                      {comic.description}
                    </p>
                    {comic.description && comic.description.length > 150 && (
                      <button 
                        onClick={() => setExpandedDescription(!expandedDescription)}
                        className="mt-2 text-primary text-sm flex items-center hover:underline"
                      >
                        {expandedDescription ? 'Show less' : 'Read more'} 
                        {expandedDescription ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link 
                    to={`/read/${comic.slug}/chapter/1`}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Start Reading <FaBookReader className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Chapters Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg mb-8"
          >
            <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center cursor-pointer" onClick={() => setExpandedChapters(!expandedChapters)}>
              <h3 className="text-lg font-semibold text-white">Chapters</h3>
              <button className="p-2 text-zinc-400 hover:text-white">
                {expandedChapters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {expandedChapters && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {comic.chapters.map((chapter, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      className="p-3 rounded-lg hover:bg-zinc-800/30 transition-colors border border-zinc-800/30"
                    >
                      <Link to={`/read/${comic.slug}/chapter/${chapter.number}`} className="flex justify-between items-center">
                        <div>
                          <span className="text-primary font-medium">Chapter {chapter.number}</span>
                          <p className="text-sm text-zinc-400 line-clamp-1">{chapter.title}</p>
                        </div>
                        <span className="text-xs text-zinc-500">{chapter.date}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Related Comics Section - just a placeholder for UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="comic-card overflow-hidden">
                  <div className="relative aspect-[2/3] bg-zinc-800 animate-pulse"></div>
                  <div className="p-2">
                    <div className="h-4 bg-zinc-800 animate-pulse rounded mb-2"></div>
                    <div className="h-3 bg-zinc-800 animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-800/50 transition-colors duration-150 ease-out hover:bg-zinc-700/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-600 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

// Make sure to import the ScrollArea components at the top of the file
import * as ScrollArea from '@radix-ui/react-scroll-area';

export default ComicInfo;
