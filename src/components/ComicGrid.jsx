import React from 'react';
import { motion } from 'framer-motion';
import ComicCard from './ComicCard'; // Assuming this component exists and handles individual comic display
import LoadingSpinner from './LoadingSpinner';

const ComicGrid = ({ comics, loading, error }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!comics || comics.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
        <p className="text-gray-500 dark:text-gray-400">No comics found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">mangaRul</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">The best comic reading website</p>
        </div>
      </section>


      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {comics.map((comic, index) => (
          <motion.div
            key={comic.slug || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="h-full" 
            whileHover={{ y: -5 }}
          >
            <ComicCard comic={comic} /> {/* Assumes ComicCard handles image size and layout */}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ComicGrid;