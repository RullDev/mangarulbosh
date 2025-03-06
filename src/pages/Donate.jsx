
import React from 'react';
import { motion } from 'framer-motion';
import { FaDonate, FaHeart, FaCoffee, FaCoins, FaGem } from 'react-icons/fa';

const Donate = () => {
  const donationOptions = [
    { icon: <FaCoffee />, title: 'Buy a Coffee', amount: '$5', color: 'bg-yellow-500' },
    { icon: <FaCoins />, title: 'Small Support', amount: '$10', color: 'bg-blue-500' },
    { icon: <FaHeart />, title: 'Generous Support', amount: '$25', color: 'bg-red-500' },
    { icon: <FaGem />, title: 'Premium Support', amount: '$50', color: 'bg-purple-500' }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="container-custom py-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <FaDonate className="text-5xl mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Support AnimaVers</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Your contribution helps us maintain the server, develop new features,
          and continue providing high-quality comics for free.
        </p>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {donationOptions.map((option, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <div className={`${option.color} p-4 text-white flex justify-between items-center`}>
              <span className="text-xl">{option.title}</span>
              <span className="text-3xl">{option.icon}</span>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{option.amount}</p>
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors">
                Donate
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Other Ways to Support</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <FaHeart className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <span>Share AnimaVers with your friends and on social media</span>
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
