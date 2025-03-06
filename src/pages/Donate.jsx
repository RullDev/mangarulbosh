
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaCoffee, 
  FaPaypal, 
  FaGift, 
  FaBitcoin, 
  FaEthereum,
  FaQuestionCircle,
  FaCheckCircle 
} from 'react-icons/fa';

const Donate = () => {
  // Animation variants
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  const paymentOptions = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <FaPaypal className="text-blue-500" />,
      description: 'Quick and easy payment via PayPal'
    },
    {
      id: 'coffee',
      name: 'Buy Me a Coffee',
      icon: <FaCoffee className="text-yellow-700" />,
      description: 'Support us with a coffee or two'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: <FaBitcoin className="text-orange-500" />,
      description: 'Donate using cryptocurrency (BTC)'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: <FaEthereum className="text-purple-500" />,
      description: 'Donate using cryptocurrency (ETH)'
    }
  ];

  const faqItems = [
    {
      question: 'Why should I donate?',
      answer: 'Your donations help us keep the servers running, add new features, and continue providing high-quality manga reading experience for free.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, all transactions are processed through secure payment processors. We never store your payment details on our servers.'
    },
    {
      question: 'Can I donate monthly?',
      answer: 'Yes! We offer recurring donation options through PayPal and Buy Me a Coffee that allow you to support us monthly.'
    },
    {
      question: 'Do I get anything for donating?',
      answer: 'Donors receive perks such as ad-free experience, early access to new features, and a special donor badge on their profile.'
    }
  ];

  return (
    <div className="container-custom py-6 min-h-screen">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2
            }}
            className="mx-auto mb-4 bg-red-100 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center"
          >
            <FaHeart className="text-4xl text-red-500" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Support AnimaVers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Your donations help us maintain our servers, develop new features, and continue providing high-quality content without intrusive ads.
          </p>
        </motion.div>

        {/* Donation Tiers */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            Choose Your Support Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5 }}
              variants={itemVariants}
            >
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaCoffee className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Small Support</h3>
              <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2">$5</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                A small donation to keep us going
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Ad-free experience for 1 month
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Supporter badge
                </li>
              </ul>
              <button className="w-full btn btn-primary">
                Donate $5
              </button>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-primary dark:border-primary-light relative transform scale-105 z-10"
              whileHover={{ y: -5 }}
              variants={itemVariants}
            >
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max">
                <span className="bg-primary dark:bg-primary-light text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaGift className="text-xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Regular Support</h3>
              <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold mb-2">$10</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Our most popular option
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Ad-free experience for 3 months
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Premium supporter badge
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Early access to new features
                </li>
              </ul>
              <button className="w-full btn btn-primary bg-purple-600 hover:bg-purple-700">
                Donate $10
              </button>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5 }}
              variants={itemVariants}
            >
              <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaHeart className="text-xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Big Support</h3>
              <p className="text-green-600 dark:text-green-400 text-2xl font-bold mb-2">$25</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                For our biggest fans
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Ad-free experience for 6 months
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Gold supporter badge
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Early access to all features
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FaCheckCircle className="text-green-500 mr-2" /> Priority support
                </li>
              </ul>
              <button className="w-full btn btn-primary bg-green-600 hover:bg-green-700">
                Donate $25
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            Payment Methods
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentOptions.map((option) => (
              <motion.div
                key={option.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-5 text-center border border-gray-100 dark:border-gray-700 flex flex-col items-center"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                variants={itemVariants}
              >
                <div className="text-3xl mb-3">{option.icon}</div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">{option.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                className={`py-4 ${index !== faqItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                variants={itemVariants}
              >
                <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-white mb-2">
                  <FaQuestionCircle className="text-primary dark:text-primary-light mr-2" />
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 pl-7">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Note */}
        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Thank you for considering supporting AnimaVers! Your generosity helps us continue providing the best manga reading experience for our community.
          </p>
          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <FaHeart className="text-red-500 animate-pulse" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Donate;
