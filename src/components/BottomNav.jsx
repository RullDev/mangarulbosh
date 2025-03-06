
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaHeart, FaBookmark } from 'react-icons/fa';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/search', icon: <FaSearch />, label: 'Search' },
    { path: '/donate', icon: <FaHeart />, label: 'Donate' },
    { path: '/bookmarks', icon: <FaBookmark />, label: 'Bookmarks' }
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center justify-center ${
              isActive(item.path) 
                ? 'text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl mb-1"
            >
              {item.icon}
            </motion.div>
            <span className="text-xs">{item.label}</span>
            
            {isActive(item.path) && (
              <motion.div
                className="absolute bottom-0 w-6 h-1 bg-blue-500 rounded-t-md"
                layoutId="bottomNavIndicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;
