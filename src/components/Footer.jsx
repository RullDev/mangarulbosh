
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Comic Reader. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub size={20} />
            </motion.a>
            
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              Made with <FaHeart className="mx-1 text-red-500" /> for comic lovers
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
