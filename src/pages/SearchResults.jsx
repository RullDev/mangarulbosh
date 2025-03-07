
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    // Focus the search input on component mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // If there's a query parameter, perform search
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, []);
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') return;
    
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const comicApi = new Comic(searchQuery);
      const searchResults = await comicApi.search();
      
      if (!searchResults || !Array.isArray(searchResults)) {
        throw new Error('Invalid search results');
      }
      
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    
    // Update URL with search query
    setSearchParams({ q: query });
    performSearch(query);
  };
  
  return (
    <div className="container-custom py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Search Comics</h1>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for manga, manhwa, comics..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          >
            <FaSearch size={18} />
          </button>
        </form>
      </motion.div>
      
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Searching for comics..." />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-10 text-center"
        >
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => performSearch(query)}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        <>
          {searchPerformed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {results.length > 0 
                    ? `Found ${results.length} results for "${searchParams.get('q')}"`
                    : `No results found for "${searchParams.get('q')}"`
                  }
                </h2>
              </div>
              
              {results.length > 0 ? (
                <ComicGrid comics={results} />
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No comics found matching your search. Try different keywords.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
