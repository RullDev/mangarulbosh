
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ searchTerm, setSearchTerm }) => {
  const [query, setQuery] = useState(searchTerm || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
                Comic Reader
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center space-x-6">
              <Link 
                to="/"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Home
              </Link>
              <Link 
                to="#popular"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Popular
              </Link>
              <Link 
                to="#latest"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Latest
              </Link>
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:ring-2 hover:ring-primary transition-all"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? 'dark' : 'light'}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="currentColor"/>
                        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </nav>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search comics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="py-2 px-4 pl-10 w-64 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
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
          <button 
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
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

            <nav className="flex flex-col space-y-4">
              <Link 
                to="/"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="#popular"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Popular
              </Link>
              <Link 
                to="#latest"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Latest
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaTimes, FaBookOpen } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-md' : 'bg-white dark:bg-gray-900'
    }`}>
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="bg-primary rounded-lg p-2 text-white"
            >
              <FaBookOpen size={20} />
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              ComicReader
            </motion.span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search comics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary w-56"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <FaSearch />
              </button>
            </form>
            
            <ThemeToggle />
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800 dark:text-white"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4"
            >
              <form onSubmit={handleSubmit} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search comics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  <FaSearch />
                </button>
              </form>
              
              <div className="flex justify-between items-center pb-4">
                <div className="text-gray-600 dark:text-gray-300">Switch Theme</div>
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
