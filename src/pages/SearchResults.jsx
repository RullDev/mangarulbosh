
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const SearchResults = ({ searchTerm: propSearchTerm }) => {
  const [searchParams] = useSearchParams();
  const querySearchTerm = searchParams.get('q');
  
  const searchTermToUse = querySearchTerm || propSearchTerm;
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTermToUse) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const comic = new Comic(searchTermToUse);
        const searchResults = await comic.search();
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search for comics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchTermToUse]);

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {searchTermToUse 
            ? `Search Results for "${searchTermToUse}"`
            : 'Please enter a search term'
          }
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {results.length > 0 
            ? `Found ${results.length} comics` 
            : loading 
              ? 'Searching...'
              : searchTermToUse
                ? 'No comics found'
                : 'Enter a term in the search box above'
          }
        </p>
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      ) : (
        <ComicGrid comics={results} />
      )}
    </div>
  );
};

export default SearchResults;
