
import React, { useState } from 'react';
import { FaHeart, FaDollarSign, FaPaypal, FaCcVisa, FaCcMastercard, FaBitcoin, FaQrcode, FaHandHoldingHeart, FaTimes, FaUserCircle } from 'react-icons/fa';
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
                Support MangaRul
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-zinc-400 text-lg max-w-2xl mx-auto"
              >
                Your donations help us maintain and improve MangaRul, ensuring we can continue to provide high-quality manga content for free.
              </motion.p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FaUserCircle className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium">Server Costs</h3>
                      <p className="text-zinc-400 text-sm">Help us keep the servers running</p>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-700/30 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-right text-xs text-zinc-400 mt-1">65% of monthly goal</div>
                </div>
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
                Donation
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* One-time donation */}
                
                  
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
                
                    
              
            </motion.div>
            
            {/* Payment Methods */}
            
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
                  <p className="text-zinc-400 mt-2">Donate via Qris code</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl mb-6 relative">
                  {/* Animated QR corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                  
                  {/* QR Code - replace with actual QR code image */}
                  <img 
                    src="https://files.catbox.moe/w86ibd.jpg" 
                    alt="Donation QR Code" 
                    className="mx-auto w-full max-w-[200px] h-auto"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-sm mb-1">You can also donate via this saweria link:</span>
                  <code className="bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 break-all">
                    https://saweria.co/RullZY
                  </code>
                </div>
              </div>
              
              <div className="p-4 bg-zinc-800/50 border-t border-zinc-700/30 text-center">
                <p className="text-zinc-300 text-sm">Thank you for supporting MangaRul! ❤️</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donate;
