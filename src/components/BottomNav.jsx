
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaBookmark, FaDonate, FaCog } from 'react-icons/fa';
import { ThemeContext } from '../App';
import ThemeToggle from './ThemeToggle';

const BottomNav = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  // Don't show bottom nav on reading page for immersive experience
  if (location.pathname.includes('/read/')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="container-custom max-w-lg mx-auto flex items-center justify-between py-2">
        <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'text-primary' : ''}`}>
          <FaHome className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/search" className={`bottom-nav-item ${isActive('/search') ? 'text-primary' : ''}`}>
          <FaSearch className="text-xl" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link to="/bookmarks" className={`bottom-nav-item ${isActive('/bookmarks') ? 'text-primary' : ''}`}>
          <FaBookmark className="text-xl" />
          <span className="text-xs mt-1">Bookmarks</span>
        </Link>
        
        <Link to="/donate" className={`bottom-nav-item ${isActive('/donate') ? 'text-primary' : ''}`}>
          <FaDonate className="text-xl" />
          <span className="text-xs mt-1">Donate</span>
        </Link>
        
        <div className="bottom-nav-item">
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <span className="text-xs mt-1">Theme</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNav;
