
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookOpen, FaCalendarAlt, FaUser, FaInfoCircle, FaList } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import Comic from '../api/comicApi';

const ComicInfo = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setLoading(true);
      try {
        const comicApi = new Comic(slug);
        const result = await comicApi.series();
        setComic(result);
      } catch (err) {
        console.error('Error fetching comic info:', err);
        setError('Failed to load comic information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComicInfo();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container-custom py-10 text-center text-red-500">{error}</div>;
  if (!comic) return <div className="container-custom py-10 text-center">Comic not found</div>;

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Comic header */}
        <div className="bg-dark text-white p-4">
          <h1 className="text-2xl font-bold">{comic.title}</h1>
        </div>

        {/* Comic info section */}
        <div className="md:flex p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/3 flex-shrink-0"
          >
            <div className="relative rounded-lg overflow-hidden shadow-md mb-4">
              <img 
                src={comic.cover} 
                alt={comic.title} 
                className="w-full h-auto"
              />
              {comic.score && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <FaStar className="mr-1" /> {comic.score}
                </div>
              )}
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-primary mr-2" />
                <span className="font-semibold">Status:</span>
                <span className="ml-2">{comic.status}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaBookOpen className="text-primary mr-2" />
                <span className="font-semibold">Type:</span>
                <span className="ml-2">{comic.type}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-primary mr-2" />
                <span className="font-semibold">Released:</span>
                <span className="ml-2">{comic.released}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaUser className="text-primary mr-2" />
                <span className="font-semibold">Author:</span>
                <span className="ml-2">{comic.author}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaList className="text-primary mr-2" />
                <span className="font-semibold">Total Chapters:</span>
                <span className="ml-2">{comic.total_chapter}</span>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Genres:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {comic.genre && comic.genre.map((genre, index) => (
                    <span 
                      key={index} 
                      className="bg-primary text-white px-2 py-1 text-xs rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-2/3 md:pl-6 mt-6 md:mt-0"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <FaInfoCircle className="mr-2 text-primary" /> Synopsis
              </h2>
              <p className="text-gray-700">{comic.synopsis}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <FaList className="mr-2 text-primary" /> Chapters
              </h2>
              <div className="bg-gray-100 rounded-lg">
                {comic.chapters && comic.chapters.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {comic.chapters.map((chapter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className="p-3"
                      >
                        <Link 
                          to={`/read/${chapter.slug}`}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-primary hover:text-secondary">
                            {chapter.title}
                          </span>
                          <span className="text-sm text-gray-500">{chapter.released}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No chapters available</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComicInfo;
