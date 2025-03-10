import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaExclamationTriangle, FaHistory, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(savedHistory);

    // Check if there's a query in the URL
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');

    if (queryParam) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchInstance = new Comic();
      const results = await searchInstance.search(query);

      // Process search results
      const processedResults = results.map(comic => ({
        ...comic,
        id: comic.slug,
        coverImage: comic.cover
      }));

      setSearchResults(processedResults);

      // Update search history
      updateSearchHistory(query);

    } catch (err) {
      console.error("Error searching:", err);
      setError("Failed to search for comics. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Update URL
    const searchParams = new URLSearchParams();
    searchParams.set('query', searchQuery);
    navigate(`/search?${searchParams.toString()}`, { replace: true });

    performSearch(searchQuery);
  };

  const updateSearchHistory = (query) => {
    const trimmedQuery = query.trim();
    let history = [...searchHistory];

    // Remove if exists already
    history = history.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());

    // Add to beginning
    history.unshift(trimmedQuery);

    // Keep only last 5
    history = history.slice(0, 5);

    setSearchHistory(history);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleHistoryItemClick = (query) => {
    setSearchQuery(query);

    // Update URL
    const searchParams = new URLSearchParams();
    searchParams.set('query', query);
    navigate(`/search?${searchParams.toString()}`, { replace: true });

    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-black pt-4 pb-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3 text-center"
          >
            Search Comics
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-center mb-8 max-w-xl mx-auto"
          >
            Find your favorite manga, manhwa, and comics from our extensive collection
          </motion.p>

          {/* Search form */}
          <motion.form 
            onSubmit={handleSearch} 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="w-full p-4 pl-12 rounded-xl bg-zinc-900/70 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                disabled={isSearching}
              >
                <FaSearch />
                <span>Search</span>
              </button>
            </div>
          </motion.form>

          {/* Search history */}
          {!hasSearched && searchHistory.length > 0 && (
            <motion.div 
              className="mb-8 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-zinc-300 font-medium flex items-center">
                  <FaHistory className="mr-2 text-zinc-500" />
                  Recent Searches
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-zinc-500 hover:text-white px-2 py-1 rounded-md hover:bg-zinc-800/70"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryItemClick(query)}
                    className="px-3 py-1.5 bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-300 rounded-full text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>{query}</span>
                    <FaArrowRight className="text-xs opacity-60" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3 overflow-hidden"
              >
                <FaExclamationTriangle className="text-red-400 text-lg flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search results */}
          {isSearching ? (
            <LoadingSpinner message="Searching for comics..." />
          ) : hasSearched ? (
            <AnimatePresence mode="wait">
              {searchResults.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-gradient-to-r from-primary/20 to-transparent p-0.5 rounded-lg mb-4"></div>
                  <h2 className="text-xl text-white mb-6 flex items-center">
                    <span className="mr-2">Results for "{searchQuery}"</span>
                    <span className="text-sm bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                      {searchResults.length}
                    </span>
                  </h2>
                  <ComicGrid comics={searchResults} />
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 bg-zinc-900/20 border border-zinc-800/50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-2xl text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    We couldn't find any comics matching "{searchQuery}". Try a different search term or browse our categories.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-16 bg-zinc-900/20 border border-zinc-800/50 rounded-xl"
            >
              <div className="w-20 h-20 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-3xl text-zinc-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Discover Amazing Comics</h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Enter a title or keyword in the search box above to find comics to read
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;