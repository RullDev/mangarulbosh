
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaSearch, FaHome, FaHeart, FaBookmark, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  const searchVariants = {
    closed: { opacity: 0, width: 0 },
    open: { opacity: 1, width: "100%" }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-zinc-800">
      <div className="container-custom py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="relative w-8 h-8 flex flex-col justify-center items-center z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
            <span className={`hamburger-line mt-1.5 ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
            <span className={`hamburger-line mt-1.5 ${isMenuOpen ? 'hamburger-open' : ''}`}></span>
          </button>
          
          <Link to="/" className="text-white font-bold text-2xl tracking-wider">
            MANGASUR
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="p-2 text-white hover:text-primary transition-colors"
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <FaTimes size={20} /> : <FaSearch size={20} />}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="absolute inset-x-0 bg-black/95 border-b border-zinc-800"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { height: 'auto', opacity: 1 },
              closed: { height: 0, opacity: 0 }
            }}
          >
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <motion.input
                  type="text"
                  placeholder="Search comics..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  initial="closed"
                  animate="open"
                  variants={searchVariants}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={toggleMenu}
          >
            <motion.div
              className="absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md p-5 rounded-b-xl border-x border-b border-zinc-800 max-w-sm mx-auto"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.nav className="flex flex-col space-y-3" variants={menuVariants}>
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 text-white hover:text-primary p-2 transition-colors rounded-lg hover:bg-white/5"
                    onClick={toggleMenu}
                  >
                    <FaHome size={18} />
                    <span className="font-medium">Home</span>
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/bookmarks" 
                    className="flex items-center gap-3 text-white hover:text-primary p-2 transition-colors rounded-lg hover:bg-white/5"
                    onClick={toggleMenu}
                  >
                    <FaBookmark size={18} />
                    <span className="font-medium">Bookmarks</span>
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Link 
                    to="/donate" 
                    className="flex items-center gap-3 text-white hover:text-primary p-2 transition-colors rounded-lg hover:bg-white/5"
                    onClick={toggleMenu}
                  >
                    <FaHeart size={18} />
                    <span className="font-medium">Donate</span>
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
