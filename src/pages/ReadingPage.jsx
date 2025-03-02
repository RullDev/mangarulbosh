import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Extract comic slug from chapter slug
  const comicSlug = slug.split('/')[0];

  useEffect(() => {
    const fetchChapterImages = async () => {
      setLoading(true);
      try {
        const comicApi = new Comic(slug);
        const results = await comicApi.read();
        setImages(results);
        
        // Get comic info to navigate between chapters
        const comicInfoApi = new Comic(comicSlug);
        const comicInfo = await comicInfoApi.series();
        setCurrentComic(comicInfo);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterImages();
  }, [slug, comicSlug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container-custom py-10 text-center text-red-500">{error}</div>;
  if (!images || images.length === 0) return <div className="container-custom py-10 text-center">No images found for this chapter</div>;

  // Find current chapter index
  const currentChapterIndex = currentComic?.chapters?.findIndex(chapter => chapter.slug === slug) || -1;
  const prevChapter = currentChapterIndex > 0 ? currentComic?.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex !== -1 && currentChapterIndex < (currentComic?.chapters?.length - 1) 
    ? currentComic?.chapters[currentChapterIndex + 1] 
    : null;

  return (
    <div className="bg-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container-custom py-4"
      >
        {/* Navigation Bar */}
        <div className="bg-gray-900 text-white rounded-lg p-4 mb-6 flex justify-between items-center">
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
            <h1 className="text-lg font-semibold">{currentComic?.title}</h1>
            <p className="text-sm text-gray-400">
              {currentComic?.chapters?.[currentChapterIndex]?.title || 'Chapter'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => prevChapter && navigate(`/read/${prevChapter.slug}`)}
              disabled={!prevChapter}
              className={`px-3 py-1 rounded flex items-center ${prevChapter ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              <FaChevronLeft className="mr-1" /> Prev
            </button>
            <button 
              onClick={() => nextChapter && navigate(`/read/${nextChapter.slug}`)}
              disabled={!nextChapter}
              className={`px-3 py-1 rounded flex items-center ${nextChapter ? 'bg-primary hover:bg-purple-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              Next <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Chapter Images */}
        <div className="flex flex-col items-center space-y-2 my-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full max-w-3xl"
            >
              <img 
                src={image.url} 
                alt={`Page ${index + 1}`} 
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-900 text-white rounded-lg p-4 mt-6 flex justify-center items-center space-x-4">
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
      </motion.div>
    </div>
  );
};

export default ReadingPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import Comic from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingPage = () => {
  const { slug } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [comicTitle, setComicTitle] = useState('');

  useEffect(() => {
    const fetchComicPages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extract comic title from slug if possible
        const titleMatch = slug.match(/(.+?)(?:-chapter|\-ch)/i);
        if (titleMatch && titleMatch[1]) {
          setComicTitle(titleMatch[1].replace(/-/g, ' ').trim());
        }
        
        const comicApi = new Comic(slug);
        const pagesData = await comicApi.read();
        
        if (pagesData.length === 0) {
          setError('No pages found for this chapter.');
        } else {
          setImages(pagesData);
          setCurrentPage(0);
        }
      } catch (err) {
        console.error('Error fetching comic pages:', err);
        setError('Failed to load comic pages.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchComicPages();
      // Scroll to top when loading a new chapter
      window.scrollTo(0, 0);
    }
  }, [slug]);

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

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="flex items-center text-white hover:text-primary-light transition-colors">
            <FaHome className="mr-2" /> Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-white font-bold">{comicTitle}</h1>
            <p className="text-gray-400 text-sm">
              Chapter {slug.match(/chapter-(\d+)|ch-(\d+)/i)?.[1] || '?'}
            </p>
          </div>
          
          <div className="text-white">
            Page {currentPage + 1}/{images.length}
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(curr => curr - 1)}
              disabled={currentPage === 0}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(curr => curr + 1)}
              disabled={currentPage === images.length - 1}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(images.length - 1)}
              disabled={currentPage === images.length - 1}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
        
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <img
            src={images[currentPage]?.url}
            alt={`Page ${currentPage + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
            }}
          />
        </motion.div>
        
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(curr => curr - 1)}
              disabled={currentPage === 0}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(curr => curr + 1)}
              disabled={currentPage === images.length - 1}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(images.length - 1)}
              disabled={currentPage === images.length - 1}
              className="btn bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;
