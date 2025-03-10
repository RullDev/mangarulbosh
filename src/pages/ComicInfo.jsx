import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBookmark, FaChevronLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import Comic from '../api/comicApi';
import * as Separator from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ComicInfo = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const comicInfo = await Comic.getInfo(id);
        setComic(comicInfo);

        const comicChapters = await Comic.getChapters(id);
        setChapters(comicChapters);
      } catch (err) {
        console.error("Error fetching comic info:", err);
        setError("Failed to load comic information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComicInfo();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-400" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="container-custom py-10 min-h-screen bg-black">
        <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg">
          Comic not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-10">
      {/* Back button */}
      <div className="container-custom pt-4">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4">
          <FaChevronLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Comic banner/cover */}
      <div className="relative h-60 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={comic.coverImage} 
          alt={comic.title} 
          className="w-full h-full object-cover object-center blur-sm opacity-30"
        />
      </div>

      {/* Comic info */}
      <div className="container-custom -mt-24 relative z-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover image */}
          <div className="w-40 md:w-56 flex-shrink-0">
            <img 
              src={comic.coverImage} 
              alt={comic.title} 
              className="w-full rounded-lg shadow-lg border border-zinc-800"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {comic.type && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-900/60 text-blue-100">
                  {comic.type}
                </span>
              )}
              {comic.status && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-900/60 text-green-100">
                  {comic.status}
                </span>
              )}
              {comic.score && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/60 text-yellow-100">
                  ★ {comic.score}
                </span>
              )}
            </div>

            <div className="text-zinc-400 mb-4">
              {comic.author && <p><strong>Author:</strong> {comic.author}</p>}
              {comic.genres && (
                <div className="mt-2">
                  <strong>Genres:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {comic.genres.map((genre, index) => (
                      <span key={index} className="bg-zinc-800 px-2 py-1 text-xs rounded-full text-zinc-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaBookmark />
              <span>Add to Favorites</span>
            </button>
          </div>
        </div>

        {/* Synopsis */}
        {comic.description && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Synopsis</h2>
            <p className="text-zinc-400 leading-relaxed">{comic.description}</p>
          </div>
        )}

        <Separator.Root className="h-px w-full bg-zinc-800 my-6" />

        {/* Chapters */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Chapters</h2>

          {chapters.length === 0 ? (
            <p className="text-zinc-400">No chapters available.</p>
          ) : (
            <ScrollArea.Root className="w-full h-[400px]">
              <ScrollArea.Viewport className="w-full h-full">
                <div className="space-y-1">
                  {chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      to={`/read/${id}/${chapter.id}`}
                      className="block p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">Chapter {chapter.number || index + 1}</span>
                        <span className="text-zinc-500 text-sm">{chapter.updatedAt}</span>
                      </div>
                      {chapter.title && (
                        <p className="text-zinc-400 text-sm mt-1">{chapter.title}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar 
                className="flex select-none touch-none p-0.5 bg-zinc-800 transition-colors duration-150 ease-out hover:bg-zinc-700 w-2.5 rounded-full"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="flex-1 bg-zinc-500 rounded-full relative" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComicInfo;