
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchInstance = new Comic(query);
        const results = await searchInstance.search();

        // Process search results
        const processedResults = results.map(comic => ({
          ...comic,
          id: comic.slug,
          coverImage: comic.cover
        }));

        setSearchResults(processedResults);
      } catch (err) {
        console.error("Error searching:", err);
        setError("Failed to search. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [query, retryCount]);

  const handleToggleFavorite = (comic) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const existingIndex = favorites.findIndex(fav => fav.slug === comic.slug);

      if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        favorites.push(comic);
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // Force re-render to update the favorite status
      setSearchResults([...searchResults]);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <ScrollArea.Root className="h-screen overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full pt-20 pb-12">
        <div className="container-custom py-8">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="mr-4 p-2.5 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700 transition-colors"
            >
              <FaArrowLeft className="text-sm" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Search Results
              </h1>
              {query && !isSearching && (
                <p className="text-zinc-400 text-sm mt-1">
                  {searchResults.length} results for "{query}"
                </p>
              )}
            </div>
          </div>

          {isSearching ? (
            <LoadingSpinner message={`Searching for "${query}"...`} />
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900/40 text-white p-6 rounded-xl flex flex-col items-center gap-4">
              <FaExclamationTriangle className="text-red-400 text-3xl" />
              <h2 className="text-lg font-semibold text-center">Search Error</h2>
              <p className="text-center text-zinc-300">{error}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : searchResults.length > 0 ? (
            <ComicGrid comics={searchResults} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-zinc-800/50 rounded-full mb-4">
                <FaSearch className="text-zinc-500 text-2xl" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">No Results Found</h2>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                We couldn't find any manga matching "{query}". Please try a different search term.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back to Browse
              </Link>
            </div>
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

export default SearchPage;
