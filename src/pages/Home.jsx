import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaArrowDown, FaBookReader, FaStar, FaBookOpen, FaFire, FaClock } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'manga', name: 'Manga' },
  { id: 'manhua', name: 'Manhua' },
  { id: 'manhwa', name: 'Manhwa' }
];

const Home = () => {
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [seriesComics, setSeriesComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false // Prevents hydration errors
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  // Simplified parallax for better performance
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  useEffect(() => {
    fetchComics();
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

  const handlePrevFeatured = () => {
    setFeaturedIndex(prev => (prev === 0 ? latestComics.length - 1 : prev - 1));
  };

  const handleNextFeatured = () => {
    setFeaturedIndex(prev => (prev === latestComics.length - 1 ? 0 : prev + 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const featuredComic = latestComics[featuredIndex];

  const SectionHeading = ({ title, icon, id }) => (
    <div className="flex items-center justify-between mb-6" id={id}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      <Link to={`/#${id}`} className="text-primary dark:text-primary-light text-sm font-medium">
        See all
      </Link>
    </div>
  );

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
      {/* AnimaVers style hero section with welcome message and featured comic */}
      <div className="bg-black text-white">
        {/* Logo and welcome message */}
        <div className="container-custom py-6 flex flex-col items-center">
          <img 
            src="https://i.imgur.com/aFqV5yM.png" 
            alt="AnimaVers Logo" 
            className="w-32 h-32 mb-4"
          />
          
          <div className="bg-gray-900 rounded-lg p-6 mb-6 w-full max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
              <FaStar className="mr-2 text-white" /> 
              Selamat Datang di AnimaVers!
            </h2>
            <p className="text-gray-300">
              Saat ini, kami berada di versi <span className="font-bold">3.3.1</span>. Jika 
              Anda memiliki keluhan atau saran, jangan ragu untuk melaporkannya kepada kami.
            </p>
          </div>
        </div>
        
        {/* Featured comic carousel */}
        {featuredComic && (
          <div className="relative w-full">
            <div className="w-full h-[300px] relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
                <img 
                  src={featuredComic.cover} 
                  alt={featuredComic.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content - positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  {featuredComic.title}
                </h2>
                
                {featuredComic.chapters && featuredComic.chapters.length > 0 && (
                  <p className="text-gray-300 mt-1">
                    Chapter {featuredComic.chapters[0].number || '??'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 py-3">
              {latestComics.slice(0, 8).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === featuredIndex 
                      ? 'bg-white w-6' 
                      : 'bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container-custom py-4">
        {/* Popular Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-1.5 rounded-full mr-2">
              <FaFire className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-blue-300">Populer</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(popularComics)} />
          
          {/* Categories Filter - horizontal scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar mt-4">
            <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              selectedCategory === 'all' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
            }`}>
              <span className="w-5 h-5 flex items-center justify-center">🌐</span>
              <span onClick={() => setSelectedCategory('all')}>All</span>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              selectedCategory === 'manga' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
            }`}>
              <span className="w-5 h-5 flex items-center justify-center">🇯🇵</span>
              <span onClick={() => setSelectedCategory('manga')}>Manga</span>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              selectedCategory === 'manhwa' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
            }`}>
              <span className="w-5 h-5 flex items-center justify-center">🇰🇷</span>
              <span onClick={() => setSelectedCategory('manhwa')}>Manhwa</span>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              selectedCategory === 'manhua' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
            }`}>
              <span className="w-5 h-5 flex items-center justify-center">🇨🇳</span>
              <span onClick={() => setSelectedCategory('manhua')}>Manhua</span>
            </div>
          </div>
        </motion.section>

        {/* Latest Updates Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center mb-4">
            <div className="bg-white p-1.5 rounded-full mr-2">
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
        >
          <div className="flex items-center mb-4">
            <div className="bg-white p-1.5 rounded-full mr-2">
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