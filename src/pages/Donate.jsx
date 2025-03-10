
import React, { useState } from 'react';
import { FaHeart, FaDollarSign, FaPaypal, FaCcVisa, FaCcMastercard, FaBitcoin, FaQrcode, FaHandHoldingHeart, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Donate = () => {
  const [isQRVisible, setIsQRVisible] = useState(false);

  const toggleQRCode = () => {
    setIsQRVisible(!isQRVisible);
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-pink-600 to-primary p-4 rounded-full inline-block mb-6">
                  <FaHandHoldingHeart className="text-white text-5xl" />
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Support MangaSur
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-zinc-400 text-lg max-w-2xl mx-auto"
              >
                Your donations help us maintain and improve MangaSur, ensuring we can continue to provide high-quality manga content for free.
              </motion.p>
            </div>
            
            {/* Donation Options */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-zinc-900/70 border border-zinc-800/50 rounded-xl p-8 backdrop-blur-sm shadow-xl mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaDollarSign className="mr-3 text-primary" />
                Donation Options
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* One-time donation */}
                <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all hover:shadow-primary/5 hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-white mb-4">One-time Donation</h3>
                  <p className="text-zinc-400 mb-6">Support us with a one-time donation of any amount. Every contribution helps!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleQRCode}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    <FaHeart />
                    Donate Now
                  </motion.button>
                </div>
                
                {/* Monthly support */}
                <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all hover:shadow-primary/5 hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-white mb-4">Monthly Support</h3>
                  <p className="text-zinc-400 mb-6">Become a regular supporter with a monthly donation to help us plan for the future.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleQRCode}
                    className="w-full bg-gradient-to-r from-secondary to-secondary-dark py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all"
                  >
                    <FaHeart />
                    Become a Supporter
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-zinc-900/70 border border-zinc-800/50 rounded-xl p-8 backdrop-blur-sm shadow-xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Accepted Payment Methods</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all">
                  <FaPaypal className="text-4xl text-blue-400 mb-3" />
                  <span className="text-white font-medium">PayPal</span>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all">
                  <FaCcVisa className="text-4xl text-blue-600 mb-3" />
                  <span className="text-white font-medium">Visa</span>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all">
                  <FaCcMastercard className="text-4xl text-orange-500 mb-3" />
                  <span className="text-white font-medium">Mastercard</span>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-zinc-700/30 hover:border-zinc-600/50 hover:shadow-lg transition-all">
                  <FaBitcoin className="text-4xl text-yellow-500 mb-3" />
                  <span className="text-white font-medium">Bitcoin</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* QR Code Popup */}
      <AnimatePresence>
        {isQRVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={toggleQRCode}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700/50 rounded-2xl overflow-hidden max-w-md w-full shadow-2xl relative"
            >
              <div className="p-6 text-center relative">
                <button 
                  onClick={toggleQRCode}
                  className="absolute right-4 top-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-2 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
                
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full inline-block mb-2">
                    <FaQrcode className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Scan to Donate</h3>
                  <p className="text-zinc-400 mt-2">Use your mobile wallet app to scan this QR code</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl mb-6 relative">
                  {/* Animated QR corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                  
                  {/* QR Code - replace with actual QR code image */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/donate" 
                    alt="Donation QR Code" 
                    className="mx-auto w-full max-w-[200px] h-auto"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-sm mb-1">You can also send to this address:</span>
                  <code className="bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 break-all">
                    example_wallet_address_123456789abcdefg
                  </code>
                </div>
              </div>
              
              <div className="p-4 bg-zinc-800/50 border-t border-zinc-700/30 text-center">
                <p className="text-zinc-300 text-sm">Thank you for supporting MangaSur! ❤️</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donate;
