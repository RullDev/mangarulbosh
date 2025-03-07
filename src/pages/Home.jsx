import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import ComicCard from '../components/ComicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../App';
import Comic from '../api/comicApi';


const Home = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      setError(null);
      try {
        const comicApi = new Comic();
        const RandomItel = await (async () => Math.floor(Math.random() * (10 - 1 + 1)) + 1)(); //Fixed randomNum function
        const latest = await comicApi.latest(RandomItel);

        if (!latest || !Array.isArray(latest)) {
          throw new Error('Failed to fetch comics data');
        }
        setComics(latest);
      } catch (err) {
        console.error("Error fetching comics:", err);
        setError("Failed to load comics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-black' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center">
            <button className="mr-4">
              <FaBars />
            </button>
            <h1 className="text-2xl font-bold">MANGARUL</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container-custom pt-20 pb-20">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Welcome To MangaRul</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Dive into the world of manga with MangaRul, your ultimate destination for the latest and
            greatest in comic reading. Enjoy high-quality mirror scans of your favorite manga, and
            discover new manga to read.
          </p>
          <div className="border-b border-gray-700 mb-6"></div>
        </section>

        {/* Latest Releases */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Latest Release</h2>
            <Link to="/releases" className="text-sm text-blue-500">View All</Link>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Discover the latest manga releases on MangaRul
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className={`text-xl text-red-500`}>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {comics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;