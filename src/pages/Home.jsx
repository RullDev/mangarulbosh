import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaFire, FaClock, FaBookOpen, FaStar, FaGlobe, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import * as Separator from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const categories = [
  { id: 'all', name: 'All', icon: <FaGlobe />, color: 'from-blue-500 to-purple-600' },
  { id: 'manga', name: 'Manga', icon: <FaBookOpen />, color: 'from-blue-500 to-cyan-400' },
  { id: 'manhua', name: 'Manhua', icon: <FaFire />, color: 'from-green-500 to-emerald-400' },
  { id: 'manhwa', name: 'Manhwa', icon: <FaStar />, color: 'from-purple-500 to-pink-500' }
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [latestComics, setLatestComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comicApi = new Comic();
        const latest = await comicApi.latest();
        const popular = await comicApi.popular();

        if (!latest || !Array.isArray(latest)) {
          throw new Error('Failed to fetch latest comics data');
        }

        if (!popular || !Array.isArray(popular)) {
          throw new Error('Failed to fetch popular comics data');
        }

        setLatestComics(latest);
        setPopularComics(popular);
      } catch (err) {
        console.error("Error fetching comics:", err);
        setError("Failed to load comics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, []);

  const filteredLatestComics = activeCategory === 'all'
    ? latestComics
    : latestComics.filter(comic => comic.type?.toLowerCase() === activeCategory);

  const filteredPopularComics = activeCategory === 'all'
    ? popularComics
    : popularComics.filter(comic => comic.type?.toLowerCase() === activeCategory);

  return (
    <div className="bg-black min-h-screen">
      <div className="container-custom pt-6 pb-20">
        <section className="mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl">
            <h1 className="text-3xl font-bold text-white mb-3">Welcome To MangaSur</h1>
            <p className="text-zinc-400">
              Dive into the world of manga with MangaSur, your ultimate destination for the latest and
              greatest in comic reading. Enjoy high-quality mirror scans of your favorite manga, and
              discover new manga to read.
            </p>
          </div>
        </section>

        <Separator.Root className="h-px w-full bg-zinc-800 my-6" />

        <section className="mb-6">
          <ScrollArea.Root className="w-full overflow-hidden">
            <ScrollArea.Viewport className="w-full">
              <div className="flex space-x-2 pb-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      activeCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="flex select-none touch-none p-0.5 bg-zinc-800 transition-colors duration-150 ease-out hover:bg-zinc-700 h-2 rounded-full"
              orientation="horizontal"
            >
              <ScrollArea.Thumb className="flex-1 bg-zinc-500 rounded-full relative" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </section>

        {/* Search bar */}
      <div className="container-custom pt-4 pb-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full md:w-3/4 lg:w-1/2 mx-auto"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const searchQuery = e.target.search.value;
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
          }}>
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search for manga, manhwa or manhua..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light/50"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-dark hover:bg-primary px-4 py-1.5 rounded-lg text-white text-sm transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-custom py-6"
        >
          <div className="bg-red-900/30 border border-red-900/50 text-red-200 p-6 rounded-lg flex flex-col items-center gap-4">
            <FaExclamationTriangle className="text-red-400 text-3xl" />
            <p className="text-center max-w-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ComicGrid
              comics={filteredLatestComics}
              title="Latest Release"
              subtitle="Discover the latest manga releases on MangaSur"
            />

            <Separator.Root className="h-px w-full bg-zinc-800 my-8" />

            <ComicGrid
              comics={filteredPopularComics}
              title="Popular Manga"
              subtitle="Top rated manga that readers are enjoying"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  </div>
);
};

export default Home;