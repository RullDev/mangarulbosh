
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';

const Donate = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container-custom py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
        >
          <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800/50 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-center mb-8">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2
                  }}
                  className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-primary/20 text-red-400"
                >
                  <FaHeart className="h-10 w-10" />
                </motion.div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
                Support MangaSur
              </h1>

              <p className="text-zinc-400 text-center mb-8">
                Your donations help us maintain and improve MangaSur so we can continue providing 
                high-quality manga content to our readers. Thank you for your support!
              </p>

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

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-center text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Donate Now
                  </motion.button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[90vw] bg-zinc-900 rounded-2xl p-6 shadow-xl z-50 border border-zinc-800/50">
                    <Dialog.Title className="text-xl font-bold text-white mb-2">
                      Support MangaSur
                    </Dialog.Title>
                    <Dialog.Description className="text-zinc-400 text-sm mb-6">
                      Your donation will help us maintain and improve the MangaSur platform.
                    </Dialog.Description>
                    
                    <div className="text-center">
                      <a
                        href="https://saweria.co/RullZY"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-medium text-center hover:shadow-lg transition-all duration-300"
                      >
                        Continue to Donation Page
                      </a>
                      <p className="mt-4 text-zinc-500 text-sm">
                        100% of donations go to server costs and development
                      </p>
                    </div>
                    
                    <Dialog.Close asChild>
                      <button className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <div className="mt-8 text-center text-sm text-zinc-500">
                <p>100% of your donation goes directly toward server costs and development.</p>
                <p className="mt-2">MangaSur is a non-profit project made with ❤️ for manga fans.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Donate;
