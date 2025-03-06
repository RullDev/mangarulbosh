
import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaFire, FaClock, FaBookOpen, FaStar } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App';

const categories = [
  { id: 'all', name: 'All', icon: '🌐' },
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
      {/* Enhanced Hero section with dynamic elements */}
      <div ref={heroRef} className="relative hero-manga overflow-hidden">
        {/* Particle background */}
        <div className="manga-particles">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="manga-particle"
              initial={{ 
                x: `${particle.x}%`, 
                y: `${particle.y}%`, 
                opacity: 0,
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)'
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

        {/* Content - MangaRul Logo and Welcome */}
        <div className="container-custom pt-16 pb-12 relative z-10 text-white">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo */}
            <motion.div 
              className="relative mb-6 flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 blur-xl"></div>
              <div className="relative z-10">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="url(#paint0_radial)" />
                  <path d="M30 35L45 50L30 65M55 35H70M55 65H70M50 25V75" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#1E3A8A" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 gradient-text"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #60a5fa, #fff, #93c5fd)' 
              }}
            >
              MangaRul
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl max-w-md mx-auto text-blue-100 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your ultimate destination for the finest manga, manhwa, and manhua collections!
            </motion.p>

            {/* Animated stats */}
            <motion.div 
              className="flex gap-4 md:gap-8 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-blue-300">10K+</span>
                <span className="text-sm text-blue-200">Titles</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-blue-300">50K+</span>
                <span className="text-sm text-blue-200">Chapters</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-blue-300">100K+</span>
                <span className="text-sm text-blue-200">Readers</span>
              </div>
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
