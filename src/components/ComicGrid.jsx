import React from 'react';
import ComicCard from './ComicCard';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ComicGrid = ({ comics, title, subtitle }) => {
  if (!comics || comics.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-zinc-400 mt-1">{subtitle}</p>}
        </div>
      )}

      <ScrollArea.Root className="w-full overflow-hidden">
        <ScrollArea.Viewport className="w-full">
          <div className="comics-grid">
            {comics.map((comic, index) => (
              <ComicCard key={comic.id || index} comic={comic} />
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar 
          className="flex select-none touch-none p-0.5 bg-zinc-800 transition-colors duration-150 ease-out hover:bg-zinc-700 h-2 rounded-full"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="flex-1 bg-zinc-500 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

export default ComicGrid;