
import React from 'react';
import ComicCard from './ComicCard';

const ComicGrid = ({ comics = [], columns = 'default' }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-200 p-4 rounded-lg text-center">
        No comics available
      </div>
    );
  }

  const gridColumns = {
    'default': 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    'small': 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4',
    'medium': 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4',
    'large': 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3'
  };

  return (
    <div className={`grid ${gridColumns[columns]} gap-4`}>
      {comics.map((comic) => (
        <ComicCard key={comic.id} comic={comic} />
      ))}
    </div>
  );
};

export default ComicGrid;
