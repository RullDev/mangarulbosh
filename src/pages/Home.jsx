
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import Comic from '../api/comicApi';
import ComicGrid from '../components/ComicGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [popularComics, setPopularComics] = useState([]);
  const [latestComics, setLatestComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        
        // Try to get comics from the API first
        try {
          const comicApi = new Comic('');
          const popular = await comicApi.popular();
          const latest = await comicApi.latest();
          
          if (popular && popular.length > 0) {
            setPopularComics(popular);
          }
          
          if (latest && latest.length > 0) {
            setLatestComics(latest);
          }
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
          
          // If API fails, try to get from localStorage or use mock data
          const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          const storedHistory = JSON.parse(localStorage.getItem('readingHistory') || '[]');
          
          if (storedFavorites.length > 0 || storedHistory.length > 0) {
            // Use favorites as popular and history as latest if available
            setPopularComics(storedFavorites.slice(0, 6));
            
            // Map history items to comic format
            const historyComics = await Promise.all(
              storedHistory.slice(0, 6).map(async (item) => {
                // Try to get comic info for this history item
                try {
                  const historyComicApi = new Comic(item.slug);
                  return await historyComicApi.info();
                } catch (err) {
                  // If no info can be retrieved, return a basic object
                  return {
                    title: item.slug.replace(/-/g, ' ')
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' '),
                    slug: item.slug,
                    cover: 'https://via.placeholder.com/300x400?text=Cover',
                    type: 'Unknown',
                    status: 'Unknown',
                    score: 'N/A'
                  };
                }
              })
            );
            
            setLatestComics(historyComics);
          } else {
            // If no stored data, use mock data
            const mockComics = [
              {
                title: "Fated To Be Loved By Villain",
                slug: "fated-to-be-loved-by-villain",
                cover: "https://via.placeholder.com/300x400?text=Manga+1",
                type: "Manga",
                status: "Ongoing",
                score: "8.9",
                chapters: [{ title: "Chapter 20" }]
              },
              {
                title: "The Necromancer Family's Youngest Son",
                slug: "the-necromancer-familys-youngest-son",
                cover: "https://via.placeholder.com/300x400?text=Manga+2",
                type: "Manga",
                status: "Ongoing",
                score: "9.1",
                chapters: [{ title: "Chapter 14" }]
              },
              {
                title: "Regress",
                slug: "regress",
                cover: "https://via.placeholder.com/300x400?text=Manga+3",
                type: "Manhwa",
                status: "Ongoing",
                score: "8.7",
                chapters: [{ title: "Chapter 35" }]
              },
              {
                title: "Player Who Can't Level Up",
                slug: "player-who-cant-level-up",
                cover: "https://via.placeholder.com/300x400?text=Manga+4",
                type: "Manhwa",
                status: "Ongoing",
                score: "8.5",
                chapters: [{ title: "Chapter 42" }]
              }
            ];
            
            setPopularComics(mockComics);
            setLatestComics(mockComics);
          }
        }
      } catch (err) {
        console.error("Error in fetchComics:", err);
        setError("Failed to load comics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Welcome to MangaSur</h1>
          <p className="text-gray-300 mb-6">
            Dive into the world of manga with MangaSur, your ultimate destination for the latest and greatest in comic reading. Enjoy high-quality mirror scans of your favorite manga, and discover new manga to read.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" id="latest">New Release</h2>
            <a href="#" className="text-primary flex items-center">
              See all <FaChevronRight className="ml-1" size={14} />
            </a>
          </div>
          <ComicGrid comics={latestComics} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" id="popular">Popular Now</h2>
            <a href="#" className="text-primary flex items-center">
              See all <FaChevronRight className="ml-1" size={14} />
            </a>
          </div>
          <ComicGrid comics={popularComics} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
