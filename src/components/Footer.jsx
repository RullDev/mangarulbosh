
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaInstagram, FaBookOpen } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 mt-12">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaBookOpen className="text-primary text-2xl" />
              <span className="text-xl font-bold">ComicVerse</span>
            </div>
            <p className="text-gray-300">
              Your ultimate destination for reading manga, manhwa, and comics online for free.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/?type=manga" className="text-gray-300 hover:text-primary transition-colors">Manga</a></li>
              <li><a href="/?type=manhwa" className="text-gray-300 hover:text-primary transition-colors">Manhwa</a></li>
              <li><a href="/?type=manhua" className="text-gray-300 hover:text-primary transition-colors">Manhua</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/?genre=action" className="text-gray-300 hover:text-primary transition-colors">Action</a></li>
              <li><a href="/?genre=adventure" className="text-gray-300 hover:text-primary transition-colors">Adventure</a></li>
              <li><a href="/?genre=romance" className="text-gray-300 hover:text-primary transition-colors">Romance</a></li>
              <li><a href="/?genre=fantasy" className="text-gray-300 hover:text-primary transition-colors">Fantasy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} ComicVerse. All rights reserved.</p>
          <p className="mt-2 text-sm">This is a demo project for educational purposes only.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
