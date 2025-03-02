
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaBookOpen, FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/search');
    }
  };

  return (
    <header className="bg-dark text-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2">
              <FaBookOpen className="text-primary text-2xl" />
              <span className="text-xl font-bold">ComicVerse</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/?type=manga" className="hover:text-primary transition-colors">Manga</Link>
            <Link to="/?type=manhwa" className="hover:text-primary transition-colors">Manhwa</Link>
            <Link to="/?type=manhua" className="hover:text-primary transition-colors">Manhua</Link>
          </nav>

          {/* Search Bar */}
          <motion.form 
            onSubmit={handleSubmit}
            className="hidden md:flex items-center relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Search comics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute right-2 text-dark hover:text-primary"
            >
              <FaSearch />
            </button>
          </motion.form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4"
          >
            <nav className="flex flex-col gap-4 pb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/?type=manga" className="hover:text-primary transition-colors">Manga</Link>
              <Link to="/?type=manhwa" className="hover:text-primary transition-colors">Manhwa</Link>
              <Link to="/?type=manhua" className="hover:text-primary transition-colors">Manhua</Link>
              <form onSubmit={handleSubmit} className="flex items-center relative mt-2">
                <input
                  type="text"
                  placeholder="Search comics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-dark hover:text-primary"
                >
                  <FaSearch />
                </button>
              </form>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
