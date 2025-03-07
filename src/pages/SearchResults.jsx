
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
        
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700/70 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-shadow duration-200 shadow-sm hover:shadow-md">
              <div className="pl-4 text-gray-500 dark:text-gray-400">
                <FaSearch size={18} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for manga, manhwa, comics..."
                className="w-full px-4 py-3 border-none bg-transparent text-gray-800 dark:text-white focus:outline-none"
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white h-full px-6 font-medium"
              >
                Search
              </motion.button>
            </div>
          </form>
          
          {/* Cat SVG Animation */}
          <div className="mt-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-40 h-40 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                {/* Cat body */}
                <motion.path
                  d="M100,150 C140,150 160,130 160,100 C160,70 140,40 100,40 C60,40 40,70 40,100 C40,130 60,150 100,150 Z"
                  fill="currentColor"
                  className="text-gray-300 dark:text-gray-700"
                  animate={{ 
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Cat face */}
                <g className="text-gray-800 dark:text-gray-300">
                  {/* Left ear */}
                  <motion.path
                    d="M65,40 L55,20 L75,30 Z"
                    fill="currentColor"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  
                  {/* Right ear */}
                  <motion.path
                    d="M135,40 L145,20 L125,30 Z"
                    fill="currentColor"
                    animate={{ rotate: [2, -2, 2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  
                  {/* Eyes */}
                  <motion.g
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    {/* Left eye */}
                    <circle cx="80" cy="80" r="5" fill="currentColor" />
                    {/* Right eye */}
                    <circle cx="120" cy="80" r="5" fill="currentColor" />
                  </motion.g>
                  
                  {/* Nose */}
                  <path d="M100,95 L95,100 L105,100 Z" fill="currentColor" />
                  
                  {/* Mouth */}
                  <motion.path
                    d="M90,110 Q100,120 110,110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{ 
                      d: ["M90,110 Q100,120 110,110", "M90,110 Q100,115 110,110", "M90,110 Q100,120 110,110"] 
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                  
                  {/* Whiskers */}
                  <motion.g
                    animate={{ x: [-1, 1, -1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    {/* Left whiskers */}
                    <line x1="60" y1="95" x2="85" y2="95" stroke="currentColor" strokeWidth="1" />
                    <line x1="60" y1="100" x2="85" y2="100" stroke="currentColor" strokeWidth="1" />
                    <line x1="60" y1="105" x2="85" y2="105" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Right whiskers */}
                    <line x1="140" y1="95" x2="115" y2="95" stroke="currentColor" strokeWidth="1" />
                    <line x1="140" y1="100" x2="115" y2="100" stroke="currentColor" strokeWidth="1" />
                    <line x1="140" y1="105" x2="115" y2="105" stroke="currentColor" strokeWidth="1" />
                  </motion.g>
                </g>
                
                {/* Tail */}
                <motion.path
                  d="M100,150 Q120,180 140,170"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-gray-400 dark:text-gray-600"
                  animate={{ 
                    d: ["M100,150 Q120,180 140,170", "M100,150 Q130,170 145,165", "M100,150 Q120,180 140,170"] 
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              </svg>
              
              {/* Cat looking for manga text */}
              <motion.div 
                className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2"
                animate={{ 
                  opacity: [0, 1, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  times: [0, 0.1, 1]
                }}
              >
                Looking for manga...
              </motion.div>
            </motion.div>
          </div>
        </div>
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
