import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaArrowDown, FaBookOpen, FaFire, FaClock } from 'react-icons/fa';
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
  // Removed scale and y transforms to reduce lag
  
  // Simplified parallax for better performance
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  useEffect(() => {
    fetchComics();
  }, []);

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
      {/* Modern Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative h-[600px] md:h-[700px] bg-gradient-to-b from-primary/5 via-primary/10 to-transparent dark:from-primary-dark/10 dark:via-primary-dark/5 dark:to-transparent overflow-hidden"
        style={{ opacity }}
      >
        {featuredComic && (
          <>
            <motion.div 
              className="absolute inset-0 z-0" 
              style={{ backgroundPositionY: bgY }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/80 to-background-light dark:from-transparent dark:via-background-dark/90 dark:to-background-dark"></div>
              <motion.div
                initial={{ filter: "blur(8px)" }}
                animate={{ filter: "blur(6px)" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="w-full h-full"
              >
                <img 
                  src={featuredComic.cover} 
                  alt={featuredComic.title} 
                  className="w-full h-full object-cover opacity-30 dark:opacity-20 scale-110"
                />
              </motion.div>
            </motion.div>

            <div className="container-custom relative z-10 py-16 min-h-[85vh] flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth slide
                }}
                className="max-w-4xl mx-auto text-center mb-12"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-3"
                >
                  <span className="bg-primary/20 dark:bg-primary-dark/30 px-4 py-1 rounded-full text-primary-dark dark:text-primary-light text-sm font-medium inline-block">
                    Modern Manga Experience
                  </span>
                </motion.div>
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-6 text-gray-800 dark:text-white drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Dive into the world of 
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-light">
                    Manga & Comics
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Explore high-quality mirror scans of your favorite manga and discover new stories to immerse yourself in.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a 
                      href="#popular" 
                      className="btn btn-primary px-8 py-3 text-lg rounded-full shadow-lg shadow-primary/20 backdrop-blur-sm"
                    >
                      Explore Library <FaArrowDown className="ml-2 inline-block" />
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={featuredComic.chapters && featuredComic.chapters.length > 0 
                        ? `/read/${featuredComic.chapters[0].slug}` 
                        : `/info/${featuredComic.slug}`
                      }
                      className="btn bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-8 py-3 text-lg rounded-full shadow-md border border-gray-200/50 dark:border-gray-700/50"
                    >
                      Read Featured
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.1, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="mt-8"
              >
                <div className="relative max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-12">
                  <motion.div 
                    className="md:w-2/5 relative z-10"
                    initial={{ opacity: 0, x: -30, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    whileHover={{ 
                      y: -8, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Link to={`/info/${featuredComic.slug}`}>
                      <div className="featured-card relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 0.4 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.img 
                          src={featuredComic.cover} 
                          alt={featuredComic.title} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 p-6 z-20"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <h3 className="text-white font-bold text-xl md:text-2xl line-clamp-2 mb-2">{featuredComic.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-md">
                              {featuredComic.type || 'Manga'}
                            </span>
                            {featuredComic.score && (
                              <span className="bg-yellow-500/90 text-white text-xs px-3 py-1 rounded-md flex items-center">
                                ★ {featuredComic.score}
                              </span>
                            )}
                            {featuredComic.status && (
                              <span className="bg-green-500/90 text-white text-xs px-3 py-1 rounded-md">
                                {featuredComic.status}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </Link>
                    
                    {/* Decorative elements */}
                    <motion.div 
                      className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-light/20 dark:bg-secondary-dark/20 rounded-full blur-2xl z-0"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div 
                      className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 dark:bg-primary-dark/20 rounded-full blur-2xl z-0"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    className="md:w-3/5 md:pl-8"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  >
                    <motion.h2 
                      className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.5 }}
                    >
                      {featuredComic.title}
                    </motion.h2>
                    
                    <motion.div
                      className="flex flex-wrap gap-2 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7, duration: 0.5 }}
                    >
                      {featuredComic.genre && featuredComic.genre.slice(0, 3).map((genre, index) => (
                        <motion.span 
                          key={index} 
                          className="bg-secondary-light/20 dark:bg-secondary-dark/20 text-secondary-dark dark:text-secondary-light px-3 py-1 rounded-full text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.8 + (index * 0.1), duration: 0.5 }}
                          whileHover={{ scale: 1.05, x: 2 }}
                        >
                          {genre.name}
                        </motion.span>
                      ))}
                    </motion.div>

                    <motion.p 
                      className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.9, duration: 0.5 }}
                    >
                      {featuredComic.synopsis || 'Dive into this exciting manga adventure and discover a world of intrigue, action, and unforgettable characters.'}
                    </motion.p>

                    <motion.div 
                      className="flex flex-wrap gap-3 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.0, duration: 0.5 }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link 
                          to={`/info/${featuredComic.slug}`}
                          className="btn btn-primary min-w-[120px]"
                        >
                          View Details
                        </Link>
                      </motion.div>

                      {featuredComic.chapters && featuredComic.chapters.length > 0 && (
                        <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={`/read/${featuredComic.chapters[0].slug}`}
                            className="btn bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 min-w-[120px] border border-gray-200/50 dark:border-gray-700/50"
                          >
                            Start Reading
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1, duration: 0.5 }}
                    >
                      <motion.div 
                        className="flex flex-wrap gap-2"
                      >
                        {featuredComic.released && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Released: {featuredComic.released}
                          </div>
                        )}
                      </motion.div>

                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.5 }}
                      >
                        <motion.button
                          onClick={handlePrevFeatured}
                          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-primary/20 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-light border border-gray-200/50 dark:border-gray-700/50"
                          whileHover={{ scale: 1.1, x: -2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronLeft />
                        </motion.button>
                        <motion.button
                          onClick={handleNextFeatured}
                          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-primary/20 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-light border border-gray-200/50 dark:border-gray-700/50"
                          whileHover={{ scale: 1.1, x: 2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronRight />
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>

      <div className="container-custom py-8">
        {/* Categories Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3 py-4">
            {categories.map(category => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-pill ${
                  selectedCategory === category.id 
                    ? 'bg-primary dark:bg-primary-dark text-white shadow-lg shadow-primary/20 dark:shadow-primary-dark/20' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                } px-6 py-2 rounded-full font-medium transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Popular Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionHeading 
            title="Popular Comics" 
            icon={<FaFire className="text-orange-500" />} 
            id="popular"
          />
          <ComicGrid comics={filterComicsByCategory(popularComics)} />
        </motion.section>

        {/* Latest Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionHeading 
            title="Latest Updates" 
            icon={<FaClock className="text-blue-500" />} 
            id="latest"
          />
          <ComicGrid comics={filterComicsByCategory(latestComics)} />
        </motion.section>

        {/* Series Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionHeading 
            title="Series Collection" 
            icon={<FaBookOpen className="text-green-500" />} 
            id="series"
          />
          <ComicGrid comics={filterComicsByCategory(seriesComics)} />
        </motion.section>

        {/* Featured Comic Navigation */}
        <div className="mt-16 mb-8 text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Featured Comics</h3>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={handlePrevFeatured}
              className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronLeft /> Previous
            </motion.button>
            <motion.button
              onClick={handleNextFeatured}
              className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next <FaChevronRight />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;