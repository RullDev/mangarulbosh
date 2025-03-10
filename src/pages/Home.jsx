
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaExclamationTriangle, FaFire, FaStar, FaClock, FaRandom, FaBookOpen } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [randomComic, setRandomComic] = useState(null);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setFavorites([]);
      }
    };

    loadFavorites();
    
    const fetchComics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Create instances for latest and popular comics
        const latestComicInstance = new Comic("1");
        const popularComicInstance = new Comic("1");
        
        // Fetch data
        const latestResults = await latestComicInstance.latest();
        const popularResults = await popularComicInstance.popular();
        
        // Normalize comic data
        const processComicData = (comics) => {
          if (!comics || !Array.isArray(comics)) return [];
          
          return comics.map(comic => ({
            ...comic,
            id: comic.slug,
            coverImage: comic.cover,
            description: comic.description || "Start reading this amazing comic now!"
          }));
        };
        
        const processedLatest = processComicData(latestResults);
        const processedPopular = processComicData(popularResults);
        
        setLatestComics(processedLatest);
        setPopularComics(processedPopular);
        
        // Set random comic
        const allComics = [...processedLatest, ...processedPopular];
        if (allComics.length > 0) {
          const randomIndex = Math.floor(Math.random() * allComics.length);
          setRandomComic(allComics[randomIndex]);
        }
      } catch (err) {
        console.error("Error fetching comics:", err);
        setError("Failed to load comics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, [retryCount]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const searchInstance = new Comic(searchQuery);
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
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = (comic) => {
    try {
      const currentFavorites = [...favorites];
      const existingIndex = currentFavorites.findIndex(fav => fav.slug === comic.slug);
      
      if (existingIndex >= 0) {
        // Remove from favorites
        currentFavorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        currentFavorites.push(comic);
      }
      
      setFavorites(currentFavorites);
      localStorage.setItem('favorites', JSON.stringify(currentFavorites));
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading comics..." />;
  }

  if (error) {
    return (
      <div className="container-custom min-h-screen bg-black py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-6 rounded-xl flex flex-col items-center gap-4">
            <FaExclamationTriangle className="text-red-400 text-4xl" />
            <h2 className="text-xl font-semibold text-center">Error Loading Comics</h2>
            <p className="text-center">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Search section */}
      <div className="relative w-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-8 md:py-16">
        <div className="container-custom">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">
            Discover Amazing Comics
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 pl-12 rounded-lg bg-zinc-900/70 backdrop-blur-md border border-zinc-700/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25 text-white"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md ${
                  isSearching || !searchQuery.trim() 
                    ? 'bg-zinc-700 text-zinc-300' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                } transition-colors`}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaSearch className="text-primary" />
              Search Results for "{searchQuery}"
            </h2>
            
            {isSearching ? (
              <LoadingSpinner message="Searching..." />
            ) : searchResults.length > 0 ? (
              <ComicGrid comics={searchResults} onToggleFavorite={handleToggleFavorite} />
            ) : (
              <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Featured comic - show only if we have data and not searching */}
        {!searchQuery && randomComic && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaRandom className="text-primary" />
              Featured Comic
            </h2>
            
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-zinc-800/50">
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <img 
                  src={randomComic.coverImage} 
                  alt={randomComic.title} 
                  className="w-full h-full object-cover object-center blur-md scale-110"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
              </div>
              <div className="relative z-10 p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-40 h-60 md:w-48 md:h-72 flex-shrink-0 overflow-hidden rounded-lg shadow-lg transform transition-transform hover:scale-105">
                  <img 
                    src={randomComic.coverImage} 
                    alt={randomComic.title} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">{randomComic.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    {randomComic.type && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100">
                        {randomComic.type}
                      </span>
                    )}
                    {randomComic.status && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100">
                        {randomComic.status}
                      </span>
                    )}
                    {randomComic.score && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/60 text-yellow-100 flex items-center gap-1">
                        <FaStar className="inline" />
                        {randomComic.score}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-zinc-300 mb-6 line-clamp-3">
                    {randomComic.description || "Start reading this amazing comic now!"}
                  </p>
                  
                  <Link 
                    to={`/comic/${randomComic.id}`} 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                  >
                    <FaBookOpen />
                    Read Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites section */}
        {favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Your Favorites
            </h2>
            <ComicGrid comics={favorites} onToggleFavorite={handleToggleFavorite} />
          </div>
        )}

        {/* Latest comics */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaClock className="text-primary" />
            Latest Updates
          </h2>
          {latestComics.length > 0 ? (
            <ComicGrid comics={latestComics} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
              No latest comics available
            </div>
          )}
        </div>

        {/* Popular comics */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaFire className="text-red-500" />
            Popular Comics
          </h2>
          {popularComics.length > 0 ? (
            <ComicGrid comics={popularComics} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
              No popular comics available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
