
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaTimesCircle, FaRegSadTear, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(!!searchParams.get('q'));
  const navigate = useNavigate();

  useEffect(() => {
    // If there's a query parameter, perform search
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setSearchInput(searchQuery);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === '') return;
    
    // Update URL with search query
    setSearchParams({ q: searchInput });
    performSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
    setResults([]);
    setSearchPerformed(false);
  };

  const handleRetry = () => {
    performSearch(searchParams.get('q'));
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-lg mb-8">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FaSearch className="mr-3 text-primary" />
                Search Comics
              </h1>
              
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for manga, manhwa, or manhua..."
                    className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-xl py-3 pl-5 pr-12 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-14 text-zinc-500 hover:text-zinc-300"
                    >
                      <FaTimesCircle />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-4 p-1 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <FaSearch size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" message="Searching for comics..." />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4"
            >
              <FaExclamationTriangle className="text-red-400 text-4xl" />
              <h2 className="text-xl font-semibold text-center">Search Error</h2>
              <p className="text-center">{error}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
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
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-zinc-300 flex items-center">
                      {results.length > 0 
                        ? (
                          <>
                            <span className="mr-2">Found {results.length} results for</span>
                            <span className="italic text-primary">"{searchParams.get('q')}"</span>
                          </>
                        )
                        : (
                          <>
                            <span className="mr-2">No results found for</span>
                            <span className="italic text-primary">"{searchParams.get('q')}"</span>
                          </>
                        )
                      }
                    </h2>
                  </div>
                  
                  {results.length > 0 ? (
                    <ComicGrid comics={results} />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="py-10 text-center bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-6"
                    >
                      <FaRegSadTear className="text-5xl text-zinc-500 mb-6 mx-auto" />
                      <h3 className="text-xl font-semibold text-white mb-3">No comics found</h3>
                      <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        We couldn't find any comics matching "{searchParams.get('q')}". 
                        Try different keywords or check the spelling.
                      </p>
                      <button 
                        onClick={clearSearch}
                        className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;
