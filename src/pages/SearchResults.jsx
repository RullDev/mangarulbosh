
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const SearchResults = ({ searchTerm }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) return;
      
      setLoading(true);
      try {
        const comicApi = new Comic(searchTerm);
        const results = await comicApi.search();
        setComics(results);
      } catch (err) {
        console.error('Error searching comics:', err);
        setError('Failed to search comics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark">Search Results</h1>
        <p className="text-gray-600 mt-2">
          {searchTerm ? `Showing results for "${searchTerm}"` : 'Enter a search term to find comics'}
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
      ) : comics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 py-10"
        >
          No comics found for "{searchTerm}". Try a different search term.
        </motion.div>
      ) : (
        <ComicGrid comics={comics} />
      )}
    </div>
  );
};

export default SearchResults;
