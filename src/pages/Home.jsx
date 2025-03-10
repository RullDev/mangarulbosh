import React, { useState, useEffect, useContext } from 'react';
import { FaSpinner, FaExclamationTriangle, FaFire, FaClock, FaBookOpen, FaStar, FaGlobe } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import * as Separator from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const categories = [
  { id: 'all', name: 'All', icon: <FaGlobe /> },
  { id: 'manga', name: 'Manga', icon: <FaBookOpen /> },
  { id: 'manhua', name: 'Manhua', icon: <FaFire /> },
  { id: 'manhwa', name: 'Manhwa', icon: <FaStar /> }
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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <ComicGrid
              comics={filteredLatestComics}
              title="Latest Release"
              subtitle="Discover the latest manga releases on MangaSur"
            />

            <Separator.Root className="h-px w-full bg-zinc-800 my-6" />

            <ComicGrid
              comics={filteredPopularComics}
              title="Popular Manga"
              subtitle="Top rated manga that readers are enjoying"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;