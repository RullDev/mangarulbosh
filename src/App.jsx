
import React, { createContext, useEffect } from 'react';
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
  // Always use dark mode
  const darkMode = true;

  useEffect(() => {
    // Always apply dark mode to body
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }, []);

  // Keep this function for compatibility but it doesn't do anything now
  const toggleDarkMode = () => {
    // Do nothing as we're always in dark mode
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
