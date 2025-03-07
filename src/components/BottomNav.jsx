
import React, { useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaHeart, 
  FaMoneyBillWave,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../App';

const BottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/search', name: 'Search', icon: <FaSearch /> },
    { path: '/bookmarks', name: 'Bookmarks', icon: <FaHeart /> },
    { path: '/donate', name: 'Donate', icon: <FaMoneyBillWave /> },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-around p-3">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-primary' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </NavLink>
          ))}
          
          <button 
            onClick={toggleMenu}
            className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <div className="text-xl">
              <FaBars />
            </div>
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Slide-up Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-16 left-0 right-0 z-40 ${darkMode ? 'bg-black' : 'bg-white'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Menu</h3>
                <button 
                  onClick={toggleMenu}
                  className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>Dark Mode</span>
                  <ThemeToggle />
                </div>
                
                <NavLink 
                  to="/settings" 
                  className={`block p-2 rounded-md ${darkMode ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={toggleMenu}
                >
                  Settings
                </NavLink>
                
                <NavLink 
                  to="/about" 
                  className={`block p-2 rounded-md ${darkMode ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={toggleMenu}
                >
                  About
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleMenu}
          className="fixed inset-0 z-30 bg-black/50"
        />
      )}
    </>
  );
};

export default BottomNav;
