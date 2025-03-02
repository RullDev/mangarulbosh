
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { 
  FaFire, 
  FaClock, 
  FaExclamationTriangle, 
  FaChevronLeft, 
  FaChevronRight,
  FaBookOpen,
  FaArrowRight,
  FaChevronDown
} from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [seriesComics, setSeriesComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredComic, setFeaturedComic] = useState(null);

  const heroRef = useRef(null);
  const latestRef = useRef(null);
  const popularRef = useRef(null);
  const seriesRef = useRef(null);
  
  const controls = useAnimation();
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false // Prevents hydration errors
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    fetchComics();
    
    // Setup intersection observers for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-50px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      });
    }, observerOptions);
    
    const sectionRefs = [latestRef, popularRef, seriesRef];
    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      sectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [controls]);

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

      // For demo purposes, let's clone and shuffle the array for popular comics
      const popular = [...latest].sort(() => 0.5 - Math.random());
      setPopularComics(popular);

      // For series, we're using the same data but imagine it's different
      const series = [...latest].sort(() => 0.5 - Math.random());
      setSeriesComics(series);
      
      // Set a featured comic for the hero section
      if (latest.length > 0) {
        setFeaturedComic(latest[0]);
      }
    } catch (err) {
      console.error("Error fetching comics:", err);
      setError("Failed to load comics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextFeatured = () => {
    if (latestComics.length > 0) {
      setFeaturedIndex((prev) => (prev + 1) % latestComics.length);
      setFeaturedComic(latestComics[(featuredIndex + 1) % latestComics.length]);
    }
  };

  const prevFeatured = () => {
    if (latestComics.length > 0) {
      setFeaturedIndex((prev) => (prev - 1 + latestComics.length) % latestComics.length);
      setFeaturedComic(latestComics[(featuredIndex - 1 + latestComics.length) % latestComics.length]);
    }
  };

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
      <motion.div 
        ref={heroRef}
        className="relative min-h-[80vh] bg-gradient-to-b from-primary/10 to-transparent dark:from-primary-dark/20 dark:to-transparent overflow-hidden"
        style={{ opacity, scale, y }}
      >
        {featuredComic && (
          <>
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/80 to-background-light dark:from-transparent dark:via-background-dark/90 dark:to-background-dark"></div>
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                src={featuredComic.cover} 
                alt={featuredComic.title} 
                className="w-full h-full object-cover opacity-30 dark:opacity-20 blur-sm"
              />
            </div>
            
            <div className="container-custom relative z-10 flex flex-col justify-center h-full py-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="md:w-1/2"
                >
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Welcome to <span className="gradient-text">MangaRul</span>
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Dive into the world of manga with MangaRul, your ultimate destination for the latest and greatest in comic reading. Enjoy high-quality mirror scans of your favorite manga, and discover new manga to read.
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={`/info/${featuredComic.slug}`} className="btn btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                        <FaBookOpen /> Explore Featured Manga
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button 
                        onClick={() => {
                          const latestSection = document.getElementById('latest');
                          if (latestSection) {
                            latestSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="btn bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white dark:hover:bg-gray-700"
                      >
                        <FaClock /> Latest Updates <FaArrowRight />
                      </button>
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="md:w-1/2 flex justify-center relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.03, rotate: 0 }}
                      initial={{ rotate: -2 }}
                      className="featured-comic-card w-64 md:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <img 
                        src={featuredComic.cover} 
                        alt={featuredComic.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-white text-xl font-bold">{featuredComic.title}</h3>
                        <p className="text-gray-300 mt-2">{featuredComic.type} • {featuredComic.status}</p>
                        {featuredComic.score && (
                          <div className="mt-2 bg-yellow-500/90 text-white text-sm font-bold py-1 px-2 rounded inline-flex items-center w-min">
                            <FaFire className="mr-1" /> {featuredComic.score}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                    <motion.button 
                      onClick={prevFeatured}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 rounded-full shadow-lg text-gray-800 dark:text-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaChevronLeft />
                    </motion.button>
                  </div>
                  
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <motion.button 
                      onClick={nextFeatured}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 rounded-full shadow-lg text-gray-800 dark:text-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaChevronRight />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </motion.div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        className="flex justify-center -mt-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown className="text-gray-800 dark:text-gray-200" />
        </motion.div>
      </motion.div>

      {/* Popular Section */}
      <motion.section
        id="popular"
        ref={popularRef}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
        className="py-16"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaFire className="mr-2 text-orange-500" /> Popular Comics
            </h2>
            <Link to="/popular" className="text-primary dark:text-primary-light hover:underline">
              See all
            </Link>
          </div>
          <ComicGrid comics={popularComics.slice(0, 6)} />
        </div>
      </motion.section>

      {/* Latest Section */}
      <motion.section
        id="latest"
        ref={latestRef}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
        className="py-16 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaClock className="mr-2 text-blue-500" /> Latest Updates
            </h2>
            <Link to="/latest" className="text-primary dark:text-primary-light hover:underline">
              See all
            </Link>
          </div>
          <ComicGrid comics={latestComics.slice(0, 12)} />
        </div>
      </motion.section>

      {/* Series Section */}
      <motion.section
        id="series"
        ref={seriesRef}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
        className="py-16"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <FaBookOpen className="mr-2 text-green-500" /> Series Collection
            </h2>
            <Link to="/series" className="text-primary dark:text-primary-light hover:underline">
              See all
            </Link>
          </div>
          <ComicGrid comics={seriesComics.slice(0, 6)} />
        </div>
      </motion.section>
    </>
  );
};

export default Home;
