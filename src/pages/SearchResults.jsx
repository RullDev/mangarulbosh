
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaExclamationTriangle, FaCat } from 'react-icons/fa';
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

  const formVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      boxShadow: "0 4px 20px rgba(var(--primary-rgb), 0.25)",
      transition: { duration: 0.3 }
    },
    blur: { 
      scale: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
  };

  const catVariants = {
    initial: { 
      y: 0
    },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className="container-custom py-6">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Search Comics
          </motion.span>
        </h1>
        
        <motion.form 
          onSubmit={handleSearch} 
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="relative search-form-group bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-lg flex overflow-hidden border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
            <motion.input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for manga, manhwa, comics..."
              className="w-full px-5 py-4 bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              variants={inputVariants}
              initial="blur"
              whileFocus="focus"
              onBlur={() => {}}
            />
            <motion.button 
              type="submit"
              className="search-button bg-primary text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaSearch size={18} className="mr-2" />
              Search
            </motion.button>
          </div>
        </motion.form>

        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="cat-animation flex flex-col items-center"
            variants={catVariants}
            initial="initial"
            animate="animate"
          >
            <FaCat className="text-6xl text-primary/70 mb-3" />
            <motion.div 
              className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Meow~ I'll help you find your favorite comics!
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {loading ? (
        <motion.div 
          className="py-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingSpinner message="Searching for comics..." />
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-10 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg"
        >
          <FaExclamationTriangle className="text-5xl text-amber-500 mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">{error}</p>
          <motion.button 
            onClick={() => performSearch(query)}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      ) : (
        <>
          {searchPerformed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-4 rounded-lg shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <motion.span 
                    animate={{ 
                      scale: results.length > 0 ? [1, 1.1, 1] : 1 
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.8,
                      times: [0, 0.5, 1]
                    }}
                    className="text-primary font-bold mr-2"
                  >
                    {results.length}
                  </motion.span>

                  {results.length > 0 
                    ? `results found for "${searchParams.get('q')}"`
                    : `No results found for "${searchParams.get('q')}"`
                  }
                </h2>
              </motion.div>
              
              {results.length > 0 ? (
                <ComicGrid comics={results} />
              ) : (
                <motion.div 
                  className="py-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No comics found matching your search. Try different keywords.
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 max-w-md mx-auto"
                  >
                    <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 p-4 rounded-lg">
                      <p className="font-medium">Tips for better search results:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Use the full title of the manga/manhwa</li>
                        <li>Try searching by author name</li>
                        <li>Use fewer keywords for broader results</li>
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
