
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ComicInfo from './pages/ComicInfo';
import ReadingPage from './pages/ReadingPage';
import SearchResults from './pages/SearchResults';
import Bookmarks from './pages/Bookmarks';
import Donate from './pages/Donate';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored in localStorage
    const saved = localStorage.getItem('darkMode');
    // Also check system preference as a fallback
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved !== null ? saved === 'true' : prefersDark;
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Floating dark mode toggle for quick access
  const FloatingThemeToggle = () => (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen app-bg">
        <FloatingThemeToggle />
        
        <main className="flex-grow pb-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/search" element={<SearchResults searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/comic/:slug" element={<ComicInfo />} />
              <Route path="/info/:slug" element={<ComicInfo />} />
              <Route path="/read/:slug" element={<ReadingPage />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <BottomNav />
      </div>
    </Router>
  );
}
