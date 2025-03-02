import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaHome, FaCog, FaTimesCircle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { chapterSlug } = useParams();
  const navigate = useNavigate();
  const [chapterImages, setChapterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('readingMode') || 'vertical');
  const [imageQuality, setImageQuality] = useState(() => localStorage.getItem('imageQuality') || 'high');

  useEffect(() => {
    const fetchChapterImages = async () => {
      setLoading(true);
      try {
        const comic = new Comic(chapterSlug);
        const images = await comic.read();

        if (!images || images.length === 0) {
          setError("No images found for this chapter");
        } else {
          setChapterImages(images);
        }
      } catch (err) {
        console.error("Error fetching chapter:", err);
        setError("Failed to load chapter. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapterImages();
  }, [chapterSlug]);

  // Extract chapter info from slug
  const getChapterInfo = () => {
    try {
      // Example format: manga-title-chapter-12
      const parts = chapterSlug.split('-');
      const chapterIndex = parts.findIndex(part => part === 'chapter');

      if (chapterIndex !== -1 && chapterIndex < parts.length - 1) {
        const chapterNum = parts[chapterIndex + 1];

        // Reconstruct the manga title
        const title = parts.slice(0, chapterIndex).join(' ');

        return {
          title: title.charAt(0).toUpperCase() + title.slice(1),
          chapter: chapterNum
        };
      }

      return { title: 'Comic', chapter: 'Unknown' };
    } catch (e) {
      return { title: 'Comic', chapter: 'Unknown' };
    }
  };

  const { title, chapter } = getChapterInfo();

  // Navigation between chapters
  const navigateToChapter = (offset) => {
    try {
      const currentChapter = parseInt(chapter);
      if (isNaN(currentChapter)) return;

      const newChapter = currentChapter + offset;
      if (newChapter <= 0) return;

      // Reconstruct the new chapter slug
      const parts = chapterSlug.split('-');
      const chapterIndex = parts.findIndex(part => part === 'chapter');

      if (chapterIndex !== -1 && chapterIndex < parts.length - 1) {
        parts[chapterIndex + 1] = newChapter.toString();
        const newSlug = parts.join('-');
        navigate(`/read/${newSlug}`);
      }
    } catch (e) {
      console.error("Navigation error:", e);
    }
  };

  const handleReadingModeChange = (mode) => {
    setReadingMode(mode);
    localStorage.setItem('readingMode', mode);
  };

  const handleImageQualityChange = (quality) => {
    setImageQuality(quality);
    localStorage.setItem('imageQuality', quality);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container-custom py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              <FaHome size={20} />
            </Link>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
              {title} - Chapter {chapter}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigateToChapter(-1)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Previous chapter"
            >
              <FaArrowLeft />
            </button>

            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Settings"
            >
              <FaCog />
            </button>

            <button 
              onClick={() => navigateToChapter(1)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600" 
              aria-label="Next chapter"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">Reading Settings</h3>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reading Mode</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleReadingModeChange('vertical')}
                  className={`py-2 px-3 rounded text-sm ${
                    readingMode === 'vertical'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Vertical
                </button>
                <button
                  onClick={() => handleReadingModeChange('horizontal')}
                  className={`py-2 px-3 rounded text-sm ${
                    readingMode === 'horizontal'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Horizontal
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Image Quality</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleImageQualityChange('low')}
                  className={`py-2 px-3 rounded text-sm ${
                    imageQuality === 'low'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Low
                </button>
                <button
                  onClick={() => handleImageQualityChange('high')}
                  className={`py-2 px-3 rounded text-sm ${
                    imageQuality === 'high'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  High
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-16 pb-4">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className={`container-custom ${readingMode === 'vertical' ? 'space-y-4' : 'flex overflow-x-auto hide-scrollbar py-4'}`}>
            {chapterImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${readingMode === 'horizontal' ? 'flex-shrink-0 mx-2' : ''}`}
              >
                <img
                  src={image.url}
                  alt={`Page ${index + 1}`}
                  className={`mx-auto ${imageQuality === 'low' ? 'w-auto max-w-full h-auto' : 'w-full max-w-3xl h-auto'} ${readingMode === 'horizontal' ? 'h-[80vh] w-auto' : ''}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md py-3">
        <div className="container-custom flex justify-between items-center">
          <button 
            onClick={() => navigateToChapter(-1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>

          <span className="text-gray-600 dark:text-gray-400">
            Chapter {chapter}
          </span>

          <button 
            onClick={() => navigateToChapter(1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center"
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;