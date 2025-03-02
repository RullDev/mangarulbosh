import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-custom py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Comic Reader. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;