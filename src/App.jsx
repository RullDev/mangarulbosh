
import React, { createContext, useEffect, useState } from 'react';
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

// Create a theme context
export const ThemeContext = createContext();

export default function App() {
  // Check if dark mode is saved in localStorage, default to true
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Apply dark mode to body based on state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className="flex flex-col min-h-screen app-bg">
          <main className="flex-grow pb-16">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/comic/:slug" element={<ComicInfo />} />
                <Route path="/info/:slug" element={<ComicInfo />} />
                <Route path="/read/:slug" element={<ReadingPage />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/donate" element={<Donate />} />
              </Routes>
            </AnimatePresence>
          </main>
          <BottomNav />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}
