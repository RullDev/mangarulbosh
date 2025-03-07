import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSort, FaSearch, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../App';
import Comic from '../api/comicApi'; // Import the comicApi

//This will be removed after the API call is implemented
// Mock data
const comicDetails = {
  title: 'Legend of Star General',
  slug: 'legend-of-star-general',
  cover: 'https://via.placeholder.com/300x450/181818/FFFFFF?text=Star+General',
  type: 'MANHUA',
  author: '乐想动漫',
  year: '2021',
  status: 'Ongoing',
  genres: ['Action', 'Drama', 'School Life'],
  description: 'Song Yunxiang Jenderal Jiwa Bintang terakhir dari Ras Manusia membawa sistem kembali ke era kampus Ketika remaja ia dibutakan oleh jiwa yang tidak utuh karena ia lemah dan hanya bisa menyaksikan kerabat dan temanteman mati di hadapannya Dalam kehidupan ini ia kembali dengan kelahiran kembali sistem dengan 60 tahun pengalaman tempur dan pengetahuan dan teknologi dan kembali ke sekolah Sejak saat itu dia biasa membangun mecha untuk melawan monster Halhal yang disesali orangorang yang dirindukan kali ini tidak akan meninggalkan penyesalan',
  chapters: [
    { number: '1', slug: 'legend-of-star-general-chapter-1', date: '26 Nov 2024' },
    { number: '265', slug: 'legend-of-star-general-chapter-265', date: '18 Mar 2025' }
  ]
};


const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false); // Added bookmark state
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        const comicApi = new Comic(slug);
        const comicData = await comicApi.info(); // Fetch comic details from API

        if (!comicData || Object.keys(comicData).length === 0) {
          throw new Error('Comic information not found');
        }

        setComic(comicData);
        checkIfBookmarked(); // Check bookmark status after fetching data

      } catch (err) {
        console.error('Error fetching comic details:', err);
        setError('Failed to load comic details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetails();
  }, [slug]);

  const checkIfBookmarked = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('comicBookmarks')) || [];
      setIsBookmarked(bookmarks.some((bookmark) => bookmark.slug === slug));
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('comicBookmarks')) || [];

      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.slug !== slug);
        localStorage.setItem('comicBookmarks', JSON.stringify(updatedBookmarks));
      } else {
        const comicBookmark = {
          slug,
          title: comic.title,
          cover: comic.cover,
          type: comic.type,
          status: comic.status,
          score: comic.score,
        };
        localStorage.setItem('comicBookmarks', JSON.stringify([...bookmarks, comicBookmark]));
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
  };

  const filteredChapters = comic?.chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <LoadingSpinner size="large" message="Loading comic info..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
        <div className="container mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <header className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-black' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">MANGARUL</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container-custom pt-20 pb-20">
        <div className="mb-6">
          <div className="mb-4">
            <span className={`uppercase text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {comic.type} • BY {comic.author}
            </span>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {comic.year} - {comic.genres?.join(', ') || 'N/A'} {/* Handle potential undefined genres */}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">{comic.title}</h2>

          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {comic.description}
          </p>

          <div className="flex space-x-3 mb-6">
            {comic.chapters && comic.chapters.length > 0 && (
              <>
                <Link to={`/read/${comic.chapters[0]?.slug}`} className="px-4 py-2 bg-gray-700 text-white rounded-md">
                  Chapter 1
                </Link>
                <Link
                  to={`/read/${comic.chapters[comic.chapters.length - 1]?.slug}`}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md"
                >
                  Chapter {comic.chapters[comic.chapters.length - 1]?.number}
                </Link>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Series Chapters</h3>
            <button className="p-2">
              <FaSort />
            </button>
          </div>

          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md ${
                darkMode
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              } border focus:outline-none`}
            />
          </div>

          <div className="space-y-3">
            {filteredChapters?.map((chapter) => (
              <Link
                key={chapter.slug}
                to={`/read/${chapter.slug}`}
                className={`block p-3 rounded-md ${
                  darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Chapter {chapter.number}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {chapter.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-20 right-4 flex flex-col space-y-3">
        <button className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <FaComment />
        </button>
        <button className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ComicInfo;