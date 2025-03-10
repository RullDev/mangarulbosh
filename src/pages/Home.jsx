import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaExclamationTriangle, FaFire, FaStar, FaClock, FaRandom, FaBookOpen, FaTimes } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';

  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
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

    // If there's an initial search query, perform search
    if (initialSearchQuery) {
      handleSearch(null, initialSearchQuery);
    }
  }, [retryCount, initialSearchQuery]);

  const handleSearch = async (e, query = searchQuery) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
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
      <div className="min-h-screen bg-black py-10 px-4">
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
      {/* Hero section */}
      <div className="bg-black py-8">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Welcome To MangaRul
          </h1>
          <p className="text-zinc-400 max-w-3xl mb-8">
            Dive into the world of manga with MangaRul, your ultimate destination for the latest and greatest in comic reading. Enjoy high-quality mirror scans of your favorite manga, and discover new manga to read.
          </p>
          <div className="w-full h-0.5 bg-zinc-800 mb-8"></div>
        </div>
      </div>

      <div className="container-custom py-4">
        {/* Search results */}
        {initialSearchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaSearch className="text-primary" />
              Search Results for "{initialSearchQuery}"
            </h2>

            {isSearching ? (
              <LoadingSpinner message="Searching..." />
            ) : searchResults.length > 0 ? (
              <ComicGrid comics={searchResults} onToggleFavorite={handleToggleFavorite} />
            ) : (
              <div className="bg-zinc-800/30 border border-zinc-700/30 p-4 rounded-lg text-zinc-400 text-center">
                No results found for "{initialSearchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Latest comics */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Latest Release
          </h2>
          <p className="text-zinc-500 text-sm mb-4">
            Discover the latest manga releases on MangaRul
          </p>
          {latestComics.length > 0 ? (
            <ComicGrid comics={latestComics} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="bg-zinc-800/30 border border-zinc-700/30 p-4 rounded-lg text-zinc-400 text-center">
              No latest comics available
            </div>
          )}
        </div>

        {/* Favorites section - Only show if user has favorites */}
        {favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Your Bookmarks
            </h2>
            <ComicGrid comics={favorites} onToggleFavorite={handleToggleFavorite} />
          </div>
        )}

        {/* Popular comics */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Popular Manga
          </h2>
          <p className="text-zinc-500 text-sm mb-4">
            Most read manga on MangaRul this week
          </p>
          {popularComics.length > 0 ? (
            <ComicGrid comics={popularComics} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="bg-zinc-800/30 border border-zinc-700/30 p-4 rounded-lg text-zinc-400 text-center">
              No popular comics available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;