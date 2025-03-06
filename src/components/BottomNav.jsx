
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaHeart, FaBookmark } from 'react-icons/fa';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="grid grid-cols-4 h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <FaHome className="text-xl mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center justify-center ${isActive('/search') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <FaSearch className="text-xl mb-1" />
          <span className="text-xs">Search</span>
        </Link>
        
        <Link 
          to="/donate" 
          className={`flex flex-col items-center justify-center ${isActive('/donate') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <FaHeart className="text-xl mb-1" />
          <span className="text-xs">Donate</span>
        </Link>
        
        <Link 
          to="/bookmarks" 
          className={`flex flex-col items-center justify-center ${isActive('/bookmarks') ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <FaBookmark className="text-xl mb-1" />
          <span className="text-xs">Bookmark</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
