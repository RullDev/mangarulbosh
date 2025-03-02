import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaHome, FaInfoCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const ReadingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentComic, setCurrentComic] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Extract comic slug from chapter slug
  const comicSlug = slug.split('/')[0];

  useEffect(() => {
    const fetchChapterImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const comicApi = new Comic(slug);
        const results = await comicApi.read();

        if (results.length === 0) {
          setError('No images found for this chapter.');
        } else {
          setImages(results);
          setCurrentPage(0);

          // Get comic info to navigate between chapters
          const comicInfoApi = new Comic(comicSlug);
          const comicInfo = await comicInfoApi.series();
          setCurrentComic(comicInfo);
        }
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterImages();
    // Scroll to top when loading a new chapter
    window.scrollTo(0, 0);
  }, [slug, comicSlug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentPage < images.length - 1) {
        setCurrentPage(curr => curr + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(curr => curr - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, images.length]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  // Handle empty array without error
  if (images.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No images available for this chapter.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  // Find current chapter index
  const currentChapterIndex = currentComic?.chapters?.findIndex(chapter => chapter.slug === slug) || -1;
  const prevChapter = currentChapterIndex > 0 ? currentComic?.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex !== -1 && currentChapterIndex < (currentComic?.chapters?.length - 1) 
    ? currentComic?.chapters[currentChapterIndex + 1] 
    : null;

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100">
      <div className="container-custom py-4">
        {/* Navigation Bar */}
        <div className="dark:bg-gray-800 bg-white text-gray-800 dark:text-white rounded-lg p-4 mb-6 flex justify-between items-center shadow-lg">
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center"
            >
              <FaHome className="mr-1" /> Home
            </button>
            <button 
              onClick={() => navigate(`/comic/${comicSlug}`)}
              className="bg-secondary hover:bg-indigo-700 text-white px-3 py-1 rounded flex items-center"
            >
              <FaInfoCircle className="mr-1" /> Comic Info
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-lg font-semibold">{currentComic?.title || 'Reading'}</h1>
            <p className="text-sm dark:text-gray-400 text-gray-600">
              {currentComic?.chapters?.[currentChapterIndex]?.title || `Page ${currentPage + 1}/${images.length}`}
            </p>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded flex items-center ${currentPage !== 0 ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              <FaChevronLeft className="mr-1" /> Prev
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(images.length - 1, prev + 1))}
              disabled={currentPage === images.length - 1}
              className={`px-3 py-1 rounded flex items-center ${currentPage !== images.length - 1 ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              Next <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Current Image */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center my-4"
        >
          <img 
            src={images[currentPage]?.url} 
            alt={`Page ${currentPage + 1}`} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
            }}
          />
        </motion.div>

        {/* Bottom Navigation */}
        <div className="dark:bg-gray-800 bg-white text-gray-800 dark:text-white rounded-lg p-4 mt-6 flex justify-center items-center space-x-4 shadow-lg">
          <button 
            onClick={() => prevChapter && navigate(`/read/${prevChapter.slug}`)}
            disabled={!prevChapter}
            className={`px-4 py-2 rounded flex items-center ${prevChapter ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            <FaChevronLeft className="mr-2" /> Previous Chapter
          </button>
          <button 
            onClick={() => navigate(`/comic/${comicSlug}`)}
            className="bg-secondary hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Back to Comic
          </button>
          <button 
            onClick={() => nextChapter && navigate(`/read/${nextChapter.slug}`)}
            disabled={!nextChapter}
            className={`px-4 py-2 rounded flex items-center ${nextChapter ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            Next Chapter <FaChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;