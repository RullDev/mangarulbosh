import React from 'react';
import ComicCard from './ComicCard';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const ComicGrid = ({ comics, onToggleFavorite }) => {
  if (!comics || comics.length === 0) {
    return (
      <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/30 p-4 text-zinc-400 text-center">
        No comics found
      </div>
    );
  }

  return (
    <ScrollArea.Root className="w-full overflow-hidden">
      <ScrollArea.Viewport className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {comics.map((comic, index) => (
            <ComicCard 
              key={comic.id || comic.slug || index} 
              comic={comic} 
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar 
        className="flex select-none touch-none p-0.5 bg-zinc-800 transition-colors duration-150 ease-out hover:bg-zinc-700 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-zinc-600 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default ComicGrid;