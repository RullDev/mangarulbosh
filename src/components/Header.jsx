
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBookmark, FaHome, FaHeart, FaUser, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
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
          <h1 className="text-2xl font-bold text-white tracking-wider">MANGARUL</h1>
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
            <Dialog.Content className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-zinc-900 z-50 p-6 shadow-xl animate-slide-in-right custom-scrollbar overflow-y-auto blackdrop-blur-xl">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <Dialog.Close asChild>
                    <button className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search manga..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                  </div>
                </form>

                <nav className="mb-8">
                  <ul className="space-y-4">
                    <li>
                      <Link 
                        to="/" 
                        className="flex items-center gap-3 text-lg text-white" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaHome className="text-primary" />
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/bookmarks" 
                        className="flex items-center gap-3 text-lg text-white" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaBookmark className="text-primary" />
                        Bookmarks
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/donate" 
                        className="flex items-center gap-3 text-lg text-white" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaHeart className="text-primary" />
                        Donate
                      </Link>
                    </li>
                  </ul>
                </nav>
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
