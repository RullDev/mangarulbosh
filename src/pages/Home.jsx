
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaStar, FaBookOpen, FaFire, FaClock } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  { id: 'all', name: 'All', icon: '🌐' },
  { id: 'manga', name: 'Manga', icon: '🇯🇵' },
  { id: 'manhua', name: 'Manhua', icon: '🇨🇳' },
  { id: 'manhwa', name: 'Manhwa', icon: '🇰🇷' }
];

const Home = ({ darkMode }) => {
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [seriesComics, setSeriesComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    fetchComics();
    
    // Hide hero section when scrolling down
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeroVisible(scrollPosition < 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto shifting interval for featured comic
  useEffect(() => {
    const interval = setInterval(() => {
      if (latestComics.length > 0) {
        setFeaturedIndex(prev => (prev === latestComics.length - 1 ? 0 : prev + 1));
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [latestComics.length]);

  const fetchComics = async () => {
    setLoading(true);
    setError(null);
    try {
      const comicApi = new Comic();
      const latest = await comicApi.latest();

      if (!latest || !Array.isArray(latest)) {
        throw new Error('Failed to fetch comics data');
      }

      setLatestComics(latest);

      // For demo purposes, let's clone and shuffle the array to use as popular comics
      const popular = [...latest].sort(() => 0.5 - Math.random());
      setPopularComics(popular);

      // For series, we're using the same data but imagine it's different
      // In a real app, you'd likely have a separate API call
      const series = [...latest].sort(() => 0.5 - Math.random());
      setSeriesComics(series);

    } catch (err) {
      console.error("Error fetching comics:", err);
      setError("Failed to load comics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterComicsByCategory = (comicsArray) => {
    if (selectedCategory === 'all') {
      return comicsArray;
    }

    return comicsArray.filter(comic => {
      const type = comic.type ? comic.type.toLowerCase() : '';
      return type.includes(selectedCategory.toLowerCase());
    });
  };

  const featuredComic = latestComics[featuredIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading amazing comics..." />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container-custom py-20 text-center"
      >
        <FaExclamationTriangle className="mx-auto text-red-500 text-5xl mb-4" />
        <p className="text-xl text-gray-700 dark:text-gray-300">{error}</p>
        <button 
          onClick={fetchComics}
          className="mt-4 btn btn-primary"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <AnimatePresence>
        {isHeroVisible && featuredComic && (
          <motion.div 
            className="bg-black text-white"
            initial={{ height: 400 }}
            animate={{ height: 400 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo and welcome message */}
            <motion.div 
              className="container-custom py-6 flex flex-col items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src="https://i.imgur.com/aFqV5yM.png" 
                alt="AnimaVers Logo" 
                className="w-32 h-32 mb-4"
              />
              
              <motion.div 
                className="bg-gray-900 rounded-lg p-6 mb-6 w-full max-w-2xl text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
                  <FaStar className="mr-2 text-white" /> 
                  Selamat Datang di AnimaVers!
                </h2>
                <p className="text-gray-300">
                  Saat ini, kami berada di versi <span className="font-bold">3.3.1</span>. Jika 
                  Anda memiliki keluhan atau saran, jangan ragu untuk melaporkannya kepada kami.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Featured comic carousel */}
            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-full h-[300px] relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
                  <motion.img 
                    src={featuredComic.cover} 
                    alt={featuredComic.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                
                {/* Content - positioned at bottom */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 z-20 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    {featuredComic.title}
                  </h2>
                  
                  <p className="text-gray-300 mt-1">
                    {featuredComic.chapter || 'Latest Chapter'}
                  </p>
                </motion.div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 py-3">
                {latestComics.slice(0, 8).map((_, idx) => (
                  <motion.button 
                    key={idx}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === featuredIndex 
                        ? 'bg-white w-6' 
                        : 'bg-gray-500'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom py-4">
        {/* Categories Filter - horizontal scrollable */}
        <motion.div 
          className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.div 
              key={category.id}
              className={`category-pill cursor-pointer ${
                selectedCategory === category.id 
                ? 'bg-gray-700 text-white dark:bg-gray-600' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="w-5 h-5 flex items-center justify-center">{category.icon}</span>
              <span>{category.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Popular Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
          id="popular"
        >
          <div className="flex items-center mb-4">
            <div className={darkMode ? "bg-gray-800" : "bg-blue-500"} className="p-1.5 rounded-full mr-2">
              <FaFire className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Populer</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(popularComics)} />
        </motion.section>

        {/* Latest Updates Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
          id="latest"
        >
          <div className="flex items-center mb-4">
            <div className="bg-white p-1.5 rounded-full mr-2 dark:bg-gray-700">
              <FaClock className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Last Update</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(latestComics)} />
        </motion.section>

        {/* Series Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
          id="series"
        >
          <div className="flex items-center mb-4">
            <div className="bg-white p-1.5 rounded-full mr-2 dark:bg-gray-700">
              <FaBookOpen className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Series Collection</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(seriesComics)} />
        </motion.section>
      </div>
    </>
  );
};

export default Home;
