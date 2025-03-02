
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaBookOpen, FaFire, FaClock, FaHome } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Header = ({ searchTerm, setSearchTerm }) => {
  const [query, setQuery] = useState(searchTerm || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll navigation helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#' + id);
    }
    setMobileMenuOpen(false);
  };
  
  useEffect(() => {
    // Check if user has a preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    
    setSearchTerm(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  // Update local state when prop changes
  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  // Menu variants for animation
  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent group-hover:from-secondary-light group-hover:to-primary transition-all duration-500">
                MangaRul
              </h1>
              <motion.div 
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary to-secondary-light rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
          </Link>

          {/* Theme Toggle on Mobile */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/"
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-1"
                >
                  <FaHome className="text-primary dark:text-primary-light" /> 
                  Home
                </Link>
                <button 
                  onClick={() => scrollToSection('popular')}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-1"
                >
                  <FaFire className="text-orange-500" /> 
                  Popular
                </button>
                <button 
                  onClick={() => scrollToSection('latest')}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-1"
                >
                  <FaClock className="text-blue-500" /> 
                  Latest
                </button>
                <button 
                  onClick={() => scrollToSection('series')}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-1"
                >
                  <FaBookOpen className="text-green-500" /> 
                  Series
                </button>
                <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </nav>

              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search comics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="py-2 px-4 pl-10 w-64 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 border border-transparent focus:border-primary-light"
                />
                <button 
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="w-6 h-5 flex flex-col justify-between"
                initial={false}
                animate={mobileMenuOpen ? "open" : "closed"}
              >
                <motion.span 
                  className="w-full h-0.5 bg-primary-dark dark:bg-primary-light rounded-full block"
                  variants={{
                    open: { rotate: 45, y: 9 },
                    closed: { rotate: 0, y: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="w-full h-0.5 bg-primary-dark dark:bg-primary-light rounded-full block"
                  variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 }
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="w-full h-0.5 bg-primary-dark dark:bg-primary-light rounded-full block"
                  variants={{
                    open: { rotate: -45, y: -9 },
                    closed: { rotate: 0, y: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-2 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search comics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="py-2 px-4 pl-10 w-full rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  <FaSearch />
                </button>
              </form>

              <motion.nav 
                className="flex flex-col space-y-4"
                variants={variants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/"
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaHome className="text-primary dark:text-primary-light" /> 
                    Home
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    onClick={() => scrollToSection('popular')}
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 py-2 w-full text-left"
                  >
                    <FaFire className="text-orange-500" /> 
                    Popular
                  </button>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    onClick={() => scrollToSection('latest')}
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 py-2 w-full text-left"
                  >
                    <FaClock className="text-blue-500" /> 
                    Latest
                  </button>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    onClick={() => scrollToSection('series')}
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 py-2 w-full text-left"
                  >
                    <FaBookOpen className="text-green-500" /> 
                    Series
                  </button>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
