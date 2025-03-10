
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBookmark, FaHome, FaHeart, FaUser, FaMoon, FaSun, FaTimes, FaList, FaBookOpen } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-black'}`}>
      <div className="container-custom py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-white tracking-wider">MANGASUR</h1>
        </Link>

        {/* Mobile Menu Button */}
        <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Dialog.Trigger asChild>
            <button 
              className="flex md:hidden flex-col justify-center items-center w-10 h-10 rounded-full text-white focus:outline-none"
              aria-label="Open menu"
            >
              <div className={`hamburger-line mb-1.5 transition-all ${isMenuOpen ? 'hamburger-open' : ''}`}></div>
              <div className={`hamburger-line mb-1.5 transition-all ${isMenuOpen ? 'hamburger-open' : ''}`}></div>
              <div className={`hamburger-line transition-all ${isMenuOpen ? 'hamburger-open' : ''}`}></div>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
            <Dialog.Content className="fixed bottom-0 left-0 right-0 h-auto max-h-[60vh] bg-zinc-900/95 rounded-t-3xl z-50 shadow-xl animate-slide-up custom-scrollbar overflow-y-auto">
              <div className="flex flex-col px-4 pt-6 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-zinc-700 rounded-full"></div>
                </div>

                <nav className="mb-6">
                  <ul className="grid grid-cols-2 gap-4">
                    <li>
                      <Link 
                        to="/" 
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaHome className="text-primary text-2xl" />
                        <span className="text-white text-sm font-medium">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/latest" 
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaBookOpen className="text-primary text-2xl" />
                        <span className="text-white text-sm font-medium">Release</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/bookmarks" 
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaBookmark className="text-primary text-2xl" />
                        <span className="text-white text-sm font-medium">Bookmarks</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/donate" 
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaHeart className="text-primary text-2xl" />
                        <span className="text-white text-sm font-medium">Donate</span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                <form onSubmit={handleSearch} className="mx-auto w-full max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search manga..."
                      className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-full px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-full hover:bg-primary-dark transition-colors"
                    >
                      <FaSearch className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex items-center gap-4">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link to="/bookmarks" className="text-zinc-400 hover:text-white transition-colors">
                    Bookmarks
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link to="/donate" className="text-zinc-400 hover:text-white transition-colors">
                    Donate
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manga..."
              className="w-full md:w-[240px] bg-zinc-800/50 border border-zinc-700/50 rounded-full px-4 py-1.5 pl-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:w-[300px] transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
