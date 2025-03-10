
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaTimesCircle, FaRegSadTear, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import ComicGrid from '../components/ComicGrid';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();
  
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setSearchPerformed(false);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      // Simulating API call with mock data
      setTimeout(() => {
        const mockResults = [
          {
            slug: 'one-piece',
            title: 'One Piece',
            cover: 'https://cdn.myanimelist.net/images/manga/3/265212.jpg',
            type: 'Manga',
            rating: 9.8
          },
          {
            slug: 'demon-slayer',
            title: 'Demon Slayer',
            cover: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg',
            type: 'Manga',
            rating: 8.9
          },
          {
            slug: 'jujutsu-kaisen',
            title: 'Jujutsu Kaisen',
            cover: 'https://cdn.myanimelist.net/images/manga/3/210341.jpg',
            type: 'Manga',
            rating: 8.7
          },
          {
            slug: 'chainsaw-man',
            title: 'Chainsaw Man',
            cover: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
            type: 'Manga',
            rating: 8.8
          }
        ].filter(comic => 
          comic.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setResults(mockResults);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to search. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
    setResults([]);
    setSearchPerformed(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <ScrollArea.Root className="h-screen overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full pt-20 pb-12 bg-black">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/40 hover:bg-zinc-800/60 px-4 py-2 rounded-full mb-6"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </button>

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
                      className="absolute right-3 bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  <p className="text-zinc-400 text-sm mr-2">Popular searches:</p>
                  {['One Piece', 'Dragon Ball', 'Naruto', 'Attack on Titan', 'Demon Slayer'].map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchInput(term);
                        setSearchParams({ q: term });
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <LoadingSpinner message="Searching for comics..." />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-10 text-center bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-6"
            >
              <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
              <p className="text-zinc-300 mb-4">{error}</p>
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
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="mb-6 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                    <h2 className="text-lg font-medium text-white flex items-center">
                      {results.length > 0 
                        ? (
                          <>
                            <span className="mr-2">Found</span>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded-md">{results.length}</span>
                            <span className="mx-2">results for</span>
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
                        className="btn bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl inline-flex items-center"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-zinc-800/50 transition-colors duration-150 ease-out hover:bg-zinc-700/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-600 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default SearchResults;
