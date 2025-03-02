
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaCalendarAlt, FaUser, FaBookOpen, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ComicInfo = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setLoading(true);
      try {
        const comicApi = new Comic(slug);
        const info = await comicApi.info();
        
        if (!info || !info.title) {
          setError("Comic information not found");
        } else {
          setComic(info);
        }
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComicInfo();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <FaExclamationTriangle className="mx-auto text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[2/3] mx-auto"
              >
                <img
                  src={comic.cover}
                  alt={comic.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-lg font-bold flex items-center">
                  <FaStar className="mr-1 text-yellow-300" />
                  {comic.score}
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
              >
                {comic.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-6 mb-6"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center mr-2">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                    <p className="text-gray-800 dark:text-gray-200">{comic.author || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary-light dark:bg-secondary-dark flex items-center justify-center mr-2">
                    <FaBookOpen className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-gray-800 dark:text-gray-200">{comic.status}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Released</p>
                    <p className="text-gray-800 dark:text-gray-200">{comic.released || 'Unknown'}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-primary mr-2">
                    {comic.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-gray-600 dark:bg-gray-700">
                    {comic.total_chapter} Chapters
                  </span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {comic.genre && comic.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-secondary-light dark:bg-secondary-dark text-white px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Synopsis</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comic.synopsis || 'No synopsis available.'}
                </p>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chapters</h3>
            
            {comic.chapters && comic.chapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comic.chapters.map((chapter, index) => (
                  <Link
                    key={index}
                    to={`/read/${chapter.slug}`}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark rounded-lg p-4 transition-colors duration-300"
                  >
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{chapter.released}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No chapters available.</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComicInfo;
