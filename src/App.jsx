import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ComicInfo from './pages/ComicInfo';
import ReadingPage from './pages/ReadingPage';
import SearchResults from './pages/SearchResults';
import Bookmarks from './pages/Bookmarks';
import Donate from './pages/Donate';
import Header from './components/Header';

// Create context for theme (still available but not used for toggle)
export const ThemeContext = createContext();

function App() {
  const [theme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme }}>
      <Router>
        <div className={`app-bg ${theme}`}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/comic/:id" element={<ComicInfo />} />
              <Route path="/info/:slug" element={<ComicInfo />} />
              <Route path="/read/:slug" element={<ReadingPage />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/donate" element={<Donate />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;