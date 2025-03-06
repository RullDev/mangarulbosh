import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaHeart, FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-900 py-2 px-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </Link>

        <Link to="/search" className={`flex flex-col items-center space-y-1 ${isActive('/search') ? 'text-primary' : 'text-gray-400'}`}>
          <FaSearch className="text-xl" />
          <span className="text-xs">Search</span>
        </Link>

        <Link to="/donate" className={`flex flex-col items-center space-y-1 ${isActive('/donate') ? 'text-primary' : 'text-gray-400'}`}>
          <FaHeart className="text-xl" />
          <span className="text-xs">Donate</span>
        </Link>

        <Link to="/bookmarks" className={`flex flex-col items-center space-y-1 ${isActive('/bookmarks') ? 'text-primary' : 'text-gray-400'}`}>
          <FaBookmark className="text-xl" />
          <span className="text-xs">Bookmarks</span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default BottomNav;