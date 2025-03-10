import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';

const ComicCard = ({ comic, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.slug === comic.slug));
    } catch (err) {
      console.error("Error checking favorites:", err);
      setIsFavorite(false);
    }
  }, [comic.slug]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(comic);
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/70 shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Cover Image with gradient overlay */}
      <Link to={`/comic/${comic.slug}`} className="block aspect-[2/3] overflow-hidden relative">
        <img
          src={comic.cover || comic.coverImage}
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Bookmark button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-all duration-300 ${
          isFavorite 
            ? 'bg-primary text-white' 
            : 'bg-black/60 text-white hover:bg-black/80'
        }`}
        aria-label={isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
      </button>

      {/* Rating badge - if comic has score */}
      {comic.score && (
        <div className="absolute top-2 left-2 flex items-center bg-black/60 px-2 py-1 rounded-full text-xs text-yellow-400">
          <FaStar className="mr-1" /> {comic.score}
        </div>
      )}

      {/* Info box */}
      <Link to={`/comic/${comic.slug}`} className="block p-3">
        <h3 className="text-white font-medium line-clamp-2 leading-snug text-sm hover:text-primary transition-colors">
          {comic.title}
        </h3>

        {/* Extra info */}
        <div className="flex flex-wrap gap-1 mt-2">
          {comic.type && (
            <span className="px-2 py-0.5 text-xs bg-zinc-800/80 text-zinc-300 rounded-md">
              {comic.type}
            </span>
          )}
          {comic.status && (
            <span className={`px-2 py-0.5 text-xs rounded-md ${
              comic.status.toLowerCase() === 'completed' 
                ? 'bg-green-900/30 text-green-400/90 border border-green-700/30' 
                : 'bg-blue-900/30 text-blue-400/90 border border-blue-700/30'
            }`}>
              {comic.status}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ComicCard;