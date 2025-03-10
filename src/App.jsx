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
 // Added import for SearchPage

// Create context for theme
export const ThemeContext = createContext();

function App() {
  const [theme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme }}>
      <Router>
        <div className={`app-bg ${theme}`}>
          {/* Don't render header on reading page */}
          <Routes>
            <Route path="/read/:slug" element={<ReadingPage />} />
            <Route path="*" element={
              <>
                <Header />
                <main className="pt-16"> {/* Add padding to account for fixed header */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchResults />} /> {/*Existing SearchResults route */}
                    <Route path="/comic/:id" element={<ComicInfo />} />
                    <Route path="/info/:slug" element={<ComicInfo />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/search" element={<SearchResults />} /> {/* Added SearchPage route */}
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;