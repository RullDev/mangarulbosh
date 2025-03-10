
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookmark, FaHeart, FaSearch, FaBars, FaUserCircle, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent scrolling when menu is open on mobile
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const navItems = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'Bookmarks', icon: <FaBookmark />, path: '/bookmarks' },
    { name: 'Donate', icon: <FaHeart />, path: '/donate' },
    { name: 'Search', icon: <FaSearch />, path: '/search' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 ${isScrolled ? 'bg-black/90 backdrop-blur shadow-lg shadow-black/20' : 'bg-black/50 backdrop-blur-sm'} transition-all duration-300`}>
      <div className="container-custom bg-black py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-2xl">
            <span className="text-primary">Manga</span>
            <span className="text-white">Rul</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary/20 text-primary' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 p-2 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <div className={`hamburger-line ${isMenuOpen ? 'hamburger-open' : ''} mb-1.5`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'hamburger-open' : ''} mb-1.5`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'hamburger-open' : ''}`}></div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800/50 shadow-xl shadow-black/40 md:hidden"
          >
            <motion.nav className="container-custom py-6 flex flex-col">
              <motion.div 
                variants={itemVariants} 
                className="border-b border-zinc-800/50 pb-4 mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                      <FaUserCircle className="text-zinc-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Guest</h3>
                      <p className="text-zinc-500 text-sm">Welcome to MangaRul</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </motion.div>
              
              {navItems.map((item) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    className={`flex items-center py-3.5 px-3 rounded-lg mb-2 transition-all ${location.pathname === item.path ? 'bg-primary/20 text-primary' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
