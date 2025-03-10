
import React from 'react';
import { Link } from 'react-router-dom';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

const ComicCard = ({ comic }) => {
  const getTypeClassName = (type) => {
    const types = {
      manga: 'bg-blue-900/60 text-blue-100',
      manhwa: 'bg-purple-900/60 text-purple-100',
      manhua: 'bg-green-900/60 text-green-100',
    };
    return types[type.toLowerCase()] || 'bg-gray-900/60 text-gray-100';
  };

  const getStatusClassName = (status) => {
    const statuses = {
      ongoing: 'bg-green-900/60 text-green-100',
      completed: 'bg-blue-900/60 text-blue-100',
    };
    return statuses[status.toLowerCase()] || 'bg-gray-900/60 text-gray-100';
  };

  return (
    <Link to={`/comic/${comic.id}`} className="group animate-fade-in">
      <div className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group-hover:translate-y-[-5px]">
        <div className="relative">
          <AspectRatio.Root ratio={2/3}>
            <img 
              src={comic.coverImage} 
              alt={comic.title} 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </AspectRatio.Root>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeClassName(comic.type)}`}>
                {comic.type}
              </span>
              {comic.status && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusClassName(comic.status)}`}>
                  {comic.status}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {comic.title}
          </h3>
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Ch. {comic.latestChapter || 'N/A'}</span>
            {comic.score && <span className="flex items-center gap-1">★ {comic.score}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComicCard;
