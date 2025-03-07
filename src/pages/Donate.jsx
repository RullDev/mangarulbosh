import React from 'react';
import { motion } from 'framer-motion';
import { FaDonate, FaHeart, FaCoffee } from 'react-icons/fa';

const Donate = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <FaDonate className="text-5xl mx-auto mb-4 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Support MangaRul</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Your contribution helps us maintain the server, develop new features,
          and continue providing high-quality comics for free.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="bg-purple-600 p-5 text-white flex justify-between items-center">
            <span className="text-2xl font-medium">Saweria</span>
            <span className="text-3xl"><FaCoffee /></span>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Support us with a coffee to keep us energized and motivated!
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-6">5,000 RP</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-1 rounded-lg transition-colors font-medium text-lg">
              Donate via Saweria
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 bg-gray-100 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-xl max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Other Ways to Support</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <FaHeart className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <span>Share MangaRul with your friends and on social media</span>
          </li>
          <li className="flex items-start">
            <FaHeart className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <span>Report bugs and suggest improvements</span>
          </li>
          <li className="flex items-start">
            <FaHeart className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <span>Join our community and participate in discussions</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Donate;