
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const Home = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentType, setCurrentType] = useState('all');
  const location = useLocation();

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        
        let results;
        if (type) {
          setCurrentType(type);
          const comicApi = new Comic(type);
          results = await comicApi.type();
        } else {
          setCurrentType('all');
          const comicApi = new Comic('1'); // Page 1 for latest comics
          results = await comicApi.latest();
        }
        
        setComics(results);
      } catch (err) {
        console.error('Error fetching comics:', err);
        setError('Failed to load comics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [location.search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const typeMap = {
    'all': 'Latest Updates',
    'manga': 'Manga',
    'manhwa': 'Manhwa',
    'manhua': 'Manhua'
  };

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark">{typeMap[currentType] || 'Comics'}</h1>
        <p className="text-gray-600 mt-2">
          Discover and read the best {currentType !== 'all' ? typeMap[currentType] : 'comics'} online.
        </p>
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-500 py-10"
        >
          {error}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ComicGrid comics={comics} />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
