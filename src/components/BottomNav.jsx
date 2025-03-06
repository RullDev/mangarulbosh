
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaHeart, FaBookmark } from 'react-icons/fa';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define navigation items
  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/search', icon: <FaSearch />, label: 'Search' },
    { path: '/bookmarks', icon: <FaBookmark />, label: 'Bookmarks' },
    { path: '/donate', icon: <FaHeart />, label: 'Donate' },
  ];
  
  // Check if we're on the reading page, where we might want to hide this
  const isReadingPage = currentPath.includes('/read/');
  
  if (isReadingPage) {
    return null; // Don't show nav on reading pages
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.path !== '/' && currentPath.startsWith(item.path));
                          
          return (
            <Link to={item.path} key={item.path} className="relative w-full h-full">
              <motion.div 
                className={`flex flex-col items-center justify-center h-full ${
                  isActive 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className="text-lg">{item.icon}</div>
                <span className="text-xs mt-1">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary dark:bg-primary-light"
                    layoutId="bottomNavIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
