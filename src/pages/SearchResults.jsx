
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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = ({ searchTerm: initialSearchTerm, setSearchTerm: parentSetSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const comicApi = new Comic(debouncedSearchTerm);
      const searchResults = await comicApi.search();
      
      if (searchResults && Array.isArray(searchResults)) {
        setResults(searchResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search comics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (parentSetSearchTerm) {
      parentSetSearchTerm(e.target.value);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    if (parentSetSearchTerm) {
      parentSetSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  return (
    <div className="container-custom py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Search Comics</h1>
        
        <div className="relative mb-8">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for comics, manga, manhwa..."
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <motion.button
            onClick={() => setDebouncedSearchTerm(searchTerm)}
            className="mt-3 btn btn-primary w-full sm:w-auto sm:absolute sm:right-0 sm:top-0 sm:mt-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch className="mr-2" />
            Search
          </motion.button>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner message="Searching comics..." />
        </div>
      ) : error ? (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaExclamationTriangle className="text-3xl text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button 
            onClick={handleSearch}
            className="mt-4 btn btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {debouncedSearchTerm && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search results for "{debouncedSearchTerm}"
              </h2>
              <div className="h-1 w-20 bg-primary dark:bg-primary-light rounded-full"></div>
            </div>
          )}

          {results.length > 0 ? (
            <ComicGrid comics={results} />
          ) : debouncedSearchTerm ? (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">No comics found for "{debouncedSearchTerm}"</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try using different keywords</p>
            </div>
          ) : (
            <div className="text-center py-10">
              <FaSearch className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Search for your favorite comics</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Enter keywords like "One Piece" or "Solo Leveling"</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;
