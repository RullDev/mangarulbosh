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
      {/* Simplified Hero Section with 16:9 Aspect Ratio */}
      <motion.div 
        ref={heroRef}
        className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-transparent dark:from-primary-dark/10 dark:via-primary-dark/5 dark:to-transparent overflow-hidden"
        style={{ opacity }}
      >
        {featuredComic && (
          <div className="container-custom py-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto overflow-hidden rounded-xl shadow-2xl"
              style={{ maxWidth: "1200px" }}
            >
              {/* 16:9 Container */}
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                {/* Sliding Animation */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
                    <motion.img 
                      src={featuredComic.cover} 
                      alt={featuredComic.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1.05 }}
                      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container-custom">
                      <div className="max-w-xl pl-4 md:pl-8">
                        <motion.h1
                          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {featuredComic.title}
                        </motion.h1>
                        
                        {/* Rating */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="flex items-center gap-3 mb-6"
                        >
                          {featuredComic.score && (
                            <div className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                              <FaStar /> {featuredComic.score}
                            </div>
                          )}
                          {featuredComic.type && (
                            <div className="bg-primary/90 text-white px-3 py-1 rounded-md text-sm font-bold">
                              {featuredComic.type}
                            </div>
                          )}
                          {featuredComic.status && (
                            <div className="bg-green-500/90 text-white px-3 py-1 rounded-md text-sm font-bold">
                              {featuredComic.status}
                            </div>
                          )}
                        </motion.div>
                        
                        {/* Navigation buttons */}
                        <motion.div
                          className="mt-4 flex items-center gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        >
                          <motion.button
                            onClick={handlePrevFeatured}
                            className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-primary/80"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaChevronLeft />
                          </motion.button>
                          <motion.button
                            onClick={handleNextFeatured}
                            className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-primary/80"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaChevronRight />
                          </motion.button>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-3"
                          >
                            <Link 
                              to={featuredComic.chapters && featuredComic.chapters.length > 0 
                                ? `/read/${featuredComic.chapters[0].slug}` 
                                : `/info/${featuredComic.slug}`
                              }
                              className="btn btn-primary"
                            >
                              Read Now
                            </Link>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
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