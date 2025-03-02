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
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  // Parallax effect for background
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

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
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-[70vh] bg-gradient-to-b from-primary/10 to-transparent dark:from-primary-dark/20 dark:to-transparent overflow-hidden"
        style={{ opacity, scale, y }}
      >
        {featuredComic && (
          <>
            <div className="absolute inset-0 z-0" style={{ backgroundPositionY: bgY }}> {/* Apply parallax effect here */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/80 to-background-light dark:from-transparent dark:via-background-dark/90 dark:to-background-dark"></div>
              <img 
                src={featuredComic.cover} 
                alt={featuredComic.title} 
                className="w-full h-full object-cover opacity-30 dark:opacity-20 blur-sm scale-110"
              />
            </div>

            <div className="container-custom relative z-10 py-16 min-h-[70vh] flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl mx-auto text-center mb-8"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white drop-shadow-lg">
                  Dive into the world of manga
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Enjoy high-quality mirror scans of your favorite manga, and discover new manga to read.
                </p>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <a 
                    href="#latest" 
                    className="btn btn-primary px-8 py-3 text-lg rounded-full shadow-lg shadow-primary/20"
                  >
                    Start Exploring <FaArrowDown className="ml-2 inline-block" />
                  </a>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <div className="relative max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-8">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="md:w-1/3 relative z-10"
                  >
                    <Link to={`/info/${featuredComic.slug}`}>
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform md:rotate-[-5deg] hover:rotate-0 transition-all duration-300">
                        <img 
                          src={featuredComic.cover} 
                          alt={featuredComic.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2">{featuredComic.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded-md">
                              {featuredComic.type || 'Unknown'}
                            </span>
                            {featuredComic.score && (
                              <span className="bg-yellow-500/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
                                ★ {featuredComic.score}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <div className="md:w-2/3 md:pl-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 dark:text-white">
                      {featuredComic.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                      {featuredComic.synopsis || 'No synopsis available.'}
                    </p>

                    <div className="flex gap-3 mb-6">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          to={`/info/${featuredComic.slug}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                      </motion.div>

                      {featuredComic.chapters && featuredComic.chapters.length > 0 && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={`/read/${featuredComic.chapters[0].slug}`}
                            className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            Start Reading
                          </Link>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {featuredComic.genre && featuredComic.genre.slice(0, 3).map((genre, index) => (
                          <span key={index} className="bg-secondary-light/20 dark:bg-secondary-dark/20 text-secondary-dark dark:text-secondary-light px-3 py-1 rounded-full text-sm">
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={handlePrevFeatured}
                          className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-primary/20 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-light"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronLeft />
                        </motion.button>
                        <motion.button
                          onClick={handleNextFeatured}
                          className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-primary/20 hover:text-primary dark:hover:bg-primary-dark/20 dark:hover:text-primary-light"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronRight />
                        </motion.button>
                      </div>
                    </div>
                  </div>
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