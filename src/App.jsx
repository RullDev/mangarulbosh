
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ComicInfo from './pages/ComicInfo';
import ReadingPage from './pages/ReadingPage';
import SearchResults from './pages/SearchResults';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults searchTerm={searchTerm} />} />
              <Route path="/comic/:slug" element={<ComicInfo />} />
              <Route path="/info/:slug" element={<ComicInfo />} />
              <Route path="/read/:slug" element={<ReadingPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
