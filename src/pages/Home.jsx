
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
      {/* Enhanced Hero section with dynamic banner */}
      <div ref={heroRef} className="relative hero-manga overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        {/* Animated manga patterns background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="manga-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 0L50 0L50 50L0 50Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle cx="25" cy="25" r="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path d="M12 12L38 38M38 12L12 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#manga-pattern)" />
          </svg>
        </div>
        
        {/* Dynamic particles */}
        <div className="manga-particles">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="manga-particle"
              initial={{ 
                x: `${particle.x}%`, 
                y: `${particle.y}%`, 
                opacity: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.4)'
              }}
              animate={{
                y: [particle.y + '%', '-10%'],
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
              style={{
                width: particle.size,
                height: particle.size
              }}
            />
          ))}
        </div>

        {/* Stylish banner with decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -right-40 md:-right-20 -top-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute -left-40 md:-left-20 -bottom-40 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500/40 to-pink-500/40 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.7, 0.5, 0.7]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>

        {/* Content - MangaRul Logo and Welcome */}
        <div className="container-custom py-16 relative z-10">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Animated logo with glow effect */}
            <motion.div 
              className="relative mb-4 flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute w-32 h-32 rounded-full bg-blue-500/30 blur-xl animate-pulse"></div>
              <div className="relative z-10">
                <motion.svg 
                  width="120" 
                  height="120" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle cx="50" cy="50" r="48" fill="url(#paint0_radial)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <motion.path 
                    d="M30 35L45 50L30 65M55 35H70M55 65H70M50 25V75" 
                    stroke="white" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    animate={{ 
                      strokeDasharray: [200, 200],
                      strokeDashoffset: [200, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <defs>
                    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
                      <stop stopColor="#3B82F6" />
                      <stop offset="0.5" stopColor="#4F46E5" />
                      <stop offset="1" stopColor="#1E3A8A" />
                    </radialGradient>
                  </defs>
                </motion.svg>
              </div>
            </motion.div>

            {/* Dynamic brand name */}
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-indigo-300">
                MangaRul
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Discover the world of illustrated stories
            </motion.p>
            
            {/* Stylish synopsis card */}
            <motion.div
              className="max-w-2xl mx-auto mb-8 px-6 py-4 bg-indigo-900/60 backdrop-blur-md rounded-xl border border-indigo-500/30 shadow-lg shadow-blue-900/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-200 leading-relaxed">
                Dive into a vast universe of incredible stories from Japan, Korea, and China. 
                From action-packed adventures to heartwarming romances, your next favorite 
                story awaits. Start reading today and join our growing community of manga enthusiasts!
              </p>
            </motion.div>

            {/* Enhanced stats section */}
            <motion.div 
              className="flex gap-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">10K+</span>
                <span className="text-sm text-blue-200">Titles</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-100">50K+</span>
                <span className="text-sm text-blue-200">Chapters</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">100K+</span>
                <span className="text-sm text-blue-200">Readers</span>
              </motion.div>
            </motion.div>
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
