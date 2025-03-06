
import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaFire, FaClock, FaBookOpen, FaStar, FaGlobe } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App';

const categories = [
  { id: 'all', name: 'All', icon: <FaGlobe /> },
  { id: 'manga', name: 'Manga', icon: '🇯🇵' },
  { id: 'manhua', name: 'Manhua', icon: '🇨🇳' },
  { id: 'manhwa', name: 'Manhwa', icon: '🇰🇷' }
];

// Generate random particles for hero section
const generateParticles = (count) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    });
  }
  return particles;
};

const Home = () => {
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [seriesComics, setSeriesComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const { darkMode } = useContext(ThemeContext);
  const particles = generateParticles(30);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
      {/* Simplified Hero section based on reference */}
      <div ref={heroRef} className="relative hero-manga overflow-hidden bg-black text-white">
        {/* Simple centered content layout */}
        <div className="container-custom py-8 relative z-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://i.imgur.com/YL3GhXk.png" 
              alt="MangaRul Logo" 
              className="w-32 h-32 object-contain"
            />
          </motion.div>

          {/* Welcome card - similar to reference */}
          <motion.div
            className="bg-gray-900 rounded-lg p-6 mb-8 w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-blue-400 mr-2">✨</span>
              <h2 className="text-2xl font-bold">Selamat Datang di MangaRul!</h2>
            </div>
            <p className="text-gray-300 mt-2">
              Saat ini, kami berada di versi <span className="bg-gray-800 px-2 py-1 rounded">3.3.1</span>. 
              Jika Anda memiliki keluhan atau saran, jangan ragu untuk melaporkannya kepada kami.
            </p>
          </motion.div>

          {/* Featured comic banner */}
          <motion.div 
            className="relative w-full max-w-md overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img 
              src="https://i.pinimg.com/originals/5e/3a/45/5e3a4560b4f257bcafd40b2c8eee1c5f.jpg" 
              alt="Featured Comic" 
              className="w-full h-80 object-cover"
            />
            
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent pt-10 pb-4 px-4">
              <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">Solo Leveling</h3>
              <div className="flex items-center text-sm">
                <span className="px-2 py-0.5 bg-primary/20 rounded mr-2">Manhwa</span>
                <span className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" /> 
                  9.8
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured comic carousel */}
        {featuredComic && (
          <motion.div 
            className="w-full relative pb-4"
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-full h-[280px] relative overflow-hidden rounded-b-3xl">
              {/* Background Image with Parallax */}
              <motion.div 
                className="absolute inset-0"
                style={{ y: bgY }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
                <img 
                  src={featuredComic.cover} 
                  alt={featuredComic.title}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
              
              {/* Content - positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  style={{ y: textY }}
                >
                  <Link to={`/comic/${featuredComic.slug}`} className="block">
                    <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {featuredComic.title}
                      </h2>
                      
                      <div className="flex items-center mt-2 text-sm text-gray-300">
                        <span className="px-2 py-0.5 bg-primary/20 rounded-full mr-2">
                          {featuredComic.type}
                        </span>
                        <span className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" /> 
                          {featuredComic.score || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 py-3">
              {latestComics.slice(0, 5).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === featuredIndex 
                      ? 'bg-primary w-5' 
                      : 'bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="container-custom py-4">
        {/* Categories Filter - horizontal scrollable */}
        <motion.div 
          className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer transition-all ${
                selectedCategory === category.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </div>
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
            <div className="bg-primary/20 p-2 rounded-full mr-2">
              <FaFire className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Popular</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(popularComics)} />
        </motion.section>

        {/* Latest Updates Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
          id="latest"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-500/20 p-2 rounded-full mr-2">
              <FaClock className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Latest Updates</h2>
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
            <div className="bg-green-500/20 p-2 rounded-full mr-2">
              <FaBookOpen className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Series Collection</h2>
          </div>
          
          <ComicGrid comics={filterComicsByCategory(seriesComics)} />
        </motion.section>
      </div>
    </>
  );
};

export default Home;
