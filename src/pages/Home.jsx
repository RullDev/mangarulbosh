import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'manga', name: 'Manga' },
  { id: 'manhua', name: 'Manhua' },
  { id: 'manhwa', name: 'Manhwa' }
];

const Home = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [retryCount, setRetryCount] = useState(0);

  const fetchComics = async () => {
    setLoading(true);
    setError(null);

    try {
      const comic = new Comic('1');
      let comicsData = await comic.latest();

      // If failed, try using a different page number
      if (!comicsData || !comicsData.length && retryCount < 2) {
        setRetryCount(prev => prev + 1);
        const comic2 = new Comic('2');
        comicsData = await comic2.latest();
      }

      // If still failed, use mock data as a fallback
      if (!comicsData || !comicsData.length) {
        comicsData = comic.getMockData();
      }

      setComics(comicsData);
    } catch (err) {
      console.error("Error fetching comics:", err);
      setError("Failed to load comics. Please try again later.");

      // Use mock data if all else fails
      const comic = new Comic('1');
      setComics(comic.getMockData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComics();
  }, []);

  const filterComicsByCategory = () => {
    if (selectedCategory === 'all') return comics;

    return comics.filter(comic => 
      comic.type && comic.type.toLowerCase().includes(selectedCategory.toLowerCase())
    );
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

  return (
    <div className="container-custom py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          Welcome to Comic Reader
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover and read your favorite comics
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-pill ${
                selectedCategory === category.id 
                  ? 'bg-primary-dark dark:bg-primary' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
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
      ) : (
        <ComicGrid comics={filterComicsByCategory()} />
      )}
    </div>
  );
};

export default Home;