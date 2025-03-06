
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

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    // Apply dark mode to body
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen app-bg">
        <main className="flex-grow pb-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults searchTerm={searchTerm} />} />
              <Route path="/comic/:slug" element={<ComicInfo />} />
              <Route path="/info/:slug" element={<ComicInfo />} />
              <Route path="/read/:slug" element={<ReadingPage />} />
              <Route path="/donate" element={<div className="container-custom py-8 min-h-screen flex items-center justify-center"><h1 className="text-2xl">Donate Page</h1></div>} />
              <Route path="/bookmarks" element={<div className="container-custom py-8 min-h-screen flex items-center justify-center"><h1 className="text-2xl">Bookmarks Page</h1></div>} />
            </Routes>
          </AnimatePresence>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}
