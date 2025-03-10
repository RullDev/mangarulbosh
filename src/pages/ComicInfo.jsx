import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Comic } from '../api/comicApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaCalendarAlt, FaRunning, FaBookmark, FaRegBookmark, FaAngleDown, FaInfoCircle, FaChevronLeft, FaEye, FaList, FaChevronRight } from 'react-icons/fa';
import * as Tabs from '@radix-ui/react-tabs';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import * as Separator from '@radix-ui/react-separator';
import * as Collapsible from '@radix-ui/react-collapsible';

const ComicInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [marathonStartChapterIndex, setMarathonStartChapterIndex] = useState(0);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const chaptersRef = useRef(null);
  const [chaptersExpanded, setChaptersExpanded] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchComic();
    checkIfBookmarked();
  }, [slug]);

  const fetchComic = async () => {
    setIsLoading(true);
    try {
      const comicInstance = new Comic(slug);
      const comicData = await comicInstance.info();
      setComic(comicData);
    } catch (err) {
      console.error("Error fetching comic:", err);
      setError("Failed to load comic information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfBookmarked = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isInBookmarks = bookmarks.some(bookmark => bookmark.slug === slug);
    setIsBookmarked(isInBookmarks);
  };

  const toggleBookmark = () => {
    if (!comic) return;

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.slug !== slug);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      const { title, cover_image, type, score } = comic;
      const newBookmark = { slug, title, cover_image, type, score };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
    }

    setIsBookmarked(!isBookmarked);
  };

  const startMarathonMode = (index = 0) => {
    if (!comic || !comic.chapters || comic.chapters.length === 0) return;

    localStorage.setItem('marathonMode', 'true');
    navigate(`/read/${comic.chapters[index].slug}`);
  };

  const truncateSynopsis = (text) => {
    if (text.length <= 300) return text;
    return text.substring(0, 300) + '...';
  };

  const scrollToChapters = () => {
    chaptersRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading comic information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary rounded-xl text-white font-medium shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!comic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      {/* Hero section with backdrop image */}
      <div 
        className="w-full h-[30vh] md:h-[40vh] relative overflow-hidden"
        style={{
          backgroundImage: `url(${comic.cover_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-zinc-950" />

        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="container mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center text-zinc-300 hover:text-white transition-colors mb-2"
            >
              <FaChevronLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden comic-info-border"
        >
          <Tabs.Root defaultValue="info" className="w-full">
            <Tabs.List className="flex px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/50">
              <Tabs.Trigger 
                value="info" 
                className="px-4 py-2 text-sm font-medium rounded-lg mr-2 data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors"
              >
                <span className="flex items-center"><FaInfoCircle className="mr-2" /> Info</span>
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="chapters" 
                className="px-4 py-2 text-sm font-medium rounded-lg mr-2 data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors"
              >
                <span className="flex items-center"><FaList className="mr-2" /> Chapters</span>
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="info" className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover image */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                    <AspectRatio.Root ratio={2/3}>
                      <img 
                        src={comic.cover_image} 
                        alt={comic.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </AspectRatio.Root>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <button 
                        onClick={() => startMarathonMode(0)}
                        className="px-4 py-2 bg-primary rounded-lg text-white font-medium flex items-center gap-2"
                      >
                        <FaEye /> Read Now
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={toggleBookmark}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-colors w-full"
                    >
                      {isBookmarked ? <FaBookmark className="text-yellow-400" /> : <FaRegBookmark />}
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>

                  {comic.chapters && comic.chapters.length > 0 && (
                    <button
                      onClick={() => startMarathonMode(0)}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-secondary to-secondary-dark rounded-lg text-white font-medium shadow-lg hover:shadow-secondary/40 transform hover:-translate-y-1 transition-all duration-300 marathon-button"
                    >
                      <FaRunning />
                      Marathon Mode
                    </button>
                  )}
                </div>

                {/* Comic details */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {comic.type && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        comic.type.toLowerCase() === 'manga' 
                          ? 'bg-blue-900/50 text-blue-200 border border-blue-800/50' 
                          : comic.type.toLowerCase() === 'manhwa' 
                          ? 'bg-purple-900/50 text-purple-200 border border-purple-800/50'
                          : 'bg-green-900/50 text-green-200 border border-green-800/50'
                      }`}>
                        {comic.type}
                      </span>
                    )}

                    {comic.score && (
                      <span className="flex items-center px-3 py-1 bg-amber-900/50 text-amber-200 text-xs font-medium rounded-full border border-amber-800/50">
                        <FaStar className="mr-1 text-amber-400" />
                        {comic.score}
                      </span>
                    )}

                    {comic.status && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        comic.status.toLowerCase().includes('ongoing') 
                          ? 'bg-green-900/50 text-green-200 border border-green-800/50' 
                          : 'bg-blue-900/50 text-blue-200 border border-blue-800/50'
                      }`}>
                        {comic.status}
                      </span>
                    )}

                    {comic.release_date && (
                      <span className="flex items-center px-3 py-1 bg-zinc-800/80 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700/50">
                        <FaCalendarAlt className="mr-1" />
                        {comic.release_date}
                      </span>
                    )}
                  </div>

                  {/* Synopsis */}
                  {comic.synopsis && (
                    <div className="bg-zinc-900/50 border border-zinc-800/30 rounded-xl p-5 mb-6">
                      <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                        <FaInfoCircle className="mr-2 text-primary" />
                        Synopsis
                      </h2>
                      <div className="space-y-4">
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                          {showFullSynopsis ? comic.synopsis : truncateSynopsis(comic.synopsis)}
                        </p>
                        {comic.synopsis.length > 300 && (
                          <button
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
                          >
                            {showFullSynopsis ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comic.alternative_titles && (
                      <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2">Alternative Titles</h3>
                        <p className="text-zinc-300">{comic.alternative_titles}</p>
                      </div>
                    )}

                    {comic.authors && (
                      <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2">Authors</h3>
                        <p className="text-zinc-300">{comic.authors}</p>
                      </div>
                    )}

                    {comic.genres && (
                      <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {comic.genres.split(',').map((genre, index) => (
                            <span key={index} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
                              {genre.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="chapters" className="p-6" ref={chaptersRef}>
              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl">
                <div className="p-4 border-b border-zinc-800/30 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Chapters</h2>
                  {comic.chapters && comic.chapters.length > 0 && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => startMarathonMode(0)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-white font-medium hover:bg-secondary-dark transition-colors"
                      >
                        <FaRunning />
                        Marathon
                      </button>
                    </div>
                  )}
                </div>

                <Collapsible.Root 
                  open={chaptersExpanded} 
                  onOpenChange={setChaptersExpanded}
                  className="w-full"
                >
                  <Collapsible.Content className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {comic.chapters && comic.chapters.length > 0 ? (
                      <div className="space-y-2">
                        {comic.chapters.map((chapter, index) => (
                          <div 
                            key={chapter.slug}
                            className="flex items-center justify-between p-3 hover:bg-zinc-800/30 rounded-lg transition-colors chapter-hover-effect"
                          >
                            <Link 
                              to={`/read/${chapter.slug}`} 
                              className="text-zinc-300 hover:text-white transition-colors w-full"
                            >
                              <div className="flex items-center justify-between">
                                <span>{chapter.title}</span>
                                <FaChevronRight className="text-zinc-500" />
                              </div>
                            </Link>
                            <button
                              onClick={() => startMarathonMode(index)}
                              className="ml-2 text-zinc-400 hover:text-secondary transition-colors"
                              title="Start marathon from this chapter"
                            >
                              <FaRunning />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-400">No chapters available</p>
                      </div>
                    )}
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      </div>
    </div>
  );
};

export default ComicInfo;