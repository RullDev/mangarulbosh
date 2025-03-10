import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookmark, FaHeart, FaSun, FaMoon, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg'
          : 'bg-black/60 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Manga<span className="text-primary">Rul</span>
          </span>
        </Link>

        {/* Search button - links to search page */}
        <Link 
          to="/search" 
          className="md:flex items-center gap-2 p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors border border-zinc-700/30"
        >
          <FaSearch />
          <span className="hidden md:inline">Search</span>
        </Link>

        {/* Navigation - desktop */}
        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                active={location.pathname === '/'}
              >
                <Link
                  to="/"
                  className={`p-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors ${
                    location.pathname === '/'
                      ? 'text-primary'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <FaHome />
                  <span>Home</span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                active={location.pathname === '/bookmarks'}
              >
                <Link
                  to="/bookmarks"
                  className={`p-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors ${
                    location.pathname === '/bookmarks'
                      ? 'text-primary'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <FaBookmark />
                  <span>Bookmarks</span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                active={location.pathname === '/donate'}
              >
                <Link
                  to="/donate"
                  className={`p-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors ${
                    location.pathname === '/donate'
                      ? 'text-primary'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <FaHeart />
                  <span>Donate</span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="p-2 text-white rounded-lg hover:bg-zinc-800/60"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" />
              <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-zinc-900 z-50 rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.25)] focus:outline-none animate-in slide-in-from-bottom">
                <div className="flex justify-center py-3 mb-1">
                  <div className="w-12 h-1.5 bg-zinc-700 rounded-full opacity-50"></div>
                </div>

                <div className="px-4 pb-8">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/80 transition-colors"
                    >
                      <FaHome className="text-primary text-xl" />
                      <span className="text-white text-sm">Home</span>
                    </Link>
                    <Link
                      to="/search"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/80 transition-colors"
                    >
                      <FaSearch className="text-primary text-xl" />
                      <span className="text-white text-sm">Search</span>
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/80 transition-colors"
                    >
                      <FaBookmark className="text-primary text-xl" />
                      <span className="text-white text-sm">Bookmarks</span>
                    </Link>
                    <Link
                      to="/donate"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/80 transition-colors"
                    >
                      <FaHeart className="text-primary text-xl" />
                      <span className="text-white text-sm">Donate</span>
                    </Link>
                  </div>
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