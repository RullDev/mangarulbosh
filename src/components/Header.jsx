import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBookmark, FaHome, FaHeart, FaTimes } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              MANGASUR
            </h1>
          </Link>

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
                    <Link to="/favorites" className="text-zinc-400 hover:text-white transition-colors">
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-9 px-3 pl-9 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-white text-sm focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm" />
            </form>
          </div>

          {/* Mobile menu button */}
          <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Dialog.Trigger asChild>
              <button 
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full bg-zinc-800"
                aria-label="Open menu"
              >
                <div className="w-5 h-0.5 bg-white mb-1"></div>
                <div className="w-5 h-0.5 bg-white"></div>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-zinc-900 z-50 shadow-xl animate-slide-in-right">
                <div className="flex flex-col h-full p-6">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-white">Menu</h2>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white">
                        <FaTimes />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSearch} className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Search titles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 px-4 pl-10 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
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
        </div>
      </div>
    </header>
  );
};

export default Header;