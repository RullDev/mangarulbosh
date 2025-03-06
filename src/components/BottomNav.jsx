import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaBookmark, FaDonate } from 'react-icons/fa';

const BottomNav = () => {
  const location = useLocation();

  // Hide bottom nav on reading page for better immersion
  if (location.pathname.includes('/read/')) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-t border-gray-200/50 dark:border-gray-800/50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="container-custom flex justify-around items-center py-2">
        <Link to="/" className={`bottom-nav-item px-4 py-2 rounded-xl ${isActive('/') ? 'active text-primary' : ''}`}>
          <FaHome className="text-xl mb-1" />
          <span className="text-xs">Home</span>
        </Link>

        <Link to="/search" className={`bottom-nav-item px-4 py-2 rounded-xl ${isActive('/search') ? 'active text-primary' : ''}`}>
          <FaSearch className="text-xl mb-1" />
          <span className="text-xs">Search</span>
        </Link>

        <Link to="/bookmarks" className={`bottom-nav-item px-4 py-2 rounded-xl ${isActive('/bookmarks') ? 'active text-primary' : ''}`}>
          <FaBookmark className="text-xl mb-1" />
          <span className="text-xs">Bookmarks</span>
        </Link>

        <Link to="/donate" className={`bottom-nav-item px-4 py-2 rounded-xl ${isActive('/donate') ? 'active text-primary' : ''}`}>
          <FaDonate className="text-xl mb-1" />
          <span className="text-xs">Donate</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default BottomNav;