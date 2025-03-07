import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Donate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-primary/5 dark:from-background-dark dark:to-primary/10">
      <div className="container-custom py-6">
        

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5
                }}
                className="h-16 w-16 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500"
              >
                <FaHeart size={28} />
              </motion.div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
              Support MangaRul
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Your donations help us maintain and improve MangaRul so we can continue providing 
              high-quality manga content to our readers. Thank you for your support!
            </p>

            <motion.a
              href="https://saweria.co/RullZY"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-primary text-white font-bold text-center text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block" // Added inline-block
            >
              Donate Now
            </motion.a>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>100% of your donation goes directly toward server costs and development.</p>
              <p className="mt-2">MangaRul is a non-profit project made with ❤️ for manga fans.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Donate;