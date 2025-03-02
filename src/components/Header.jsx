import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaTimes, FaHome, FaBookOpen } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Header = ({ searchTerm, setSearchTerm }) => {
  const [query, setQuery] = useState(searchTerm || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark !== null ? isDark : true); // Default to dark if not set

    if (isDark !== false) { // Default to dark if not explicitly set to false
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
    <header className="bg-black text-white">
      {/* Top search bar */}
      <div className="bg-neutral-900 py-3 px-4 flex items-center justify-between">
        <Link to="/" className="text-white">
          <FaHome size={24} />
        </Link>

        <form onSubmit={handleSearch} className="flex-grow mx-4 relative">
          <div className="bg-neutral-800 rounded-full flex items-center px-4 py-2">
            <FaSearch className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="mangasur.ovh"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white w-full focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
          <button className="bg-neutral-700 w-8 h-8 flex items-center justify-center rounded-full">
            87
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-custom py-4 flex items-center justify-between border-b border-neutral-800">
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white">
              MANGASUR
            </h1>
          </motion.div>
        </Link>

        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black"
          >
            <nav className="container-custom py-4 flex flex-col space-y-4">
              <Link 
                to="/"
                className="text-white flex items-center space-x-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <Link 
                to="/#popular"
                className="text-white flex items-center space-x-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBookOpen />
                <span>Popular</span>
              </Link>
              <Link 
                to="/#latest"
                className="text-white flex items-center space-x-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Latest</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;