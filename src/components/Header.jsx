
import React from 'react';
import { Link } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { FaBars, FaSearch, FaHome, FaFire, FaBookOpen, FaStar } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-zinc-800">
      <div className="container-custom py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="p-2 text-white">
                <FaBars size={24} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-0 top-0 h-full w-[80%] max-w-[300px] bg-zinc-900 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <Dialog.Close asChild>
                    <button className="text-white hover:text-gray-400">
                      <IoMdClose size={24} />
                    </button>
                  </Dialog.Close>
                </div>
                
                <NavigationMenu.Root className="relative">
                  <NavigationMenu.List className="flex flex-col space-y-4">
                    <NavigationMenu.Item>
                      <NavigationMenu.Link asChild>
                        <Link to="/" className="flex items-center gap-3 text-white hover:text-primary p-2">
                          <FaHome size={18} />
                          <span>Home</span>
                        </Link>
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <NavigationMenu.Link asChild>
                        <Link to="/latest" className="flex items-center gap-3 text-white hover:text-primary p-2">
                          <FaFire size={18} />
                          <span>Latest</span>
                        </Link>
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <NavigationMenu.Link asChild>
                        <Link to="/manga" className="flex items-center gap-3 text-white hover:text-primary p-2">
                          <FaBookOpen size={18} />
                          <span>Manga</span>
                        </Link>
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <NavigationMenu.Link asChild>
                        <Link to="/favorites" className="flex items-center gap-3 text-white hover:text-primary p-2">
                          <FaStar size={18} />
                          <span>Favorites</span>
                        </Link>
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          
          <Link to="/" className="text-white font-bold text-2xl tracking-wider">
            MANGASUR
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-white">
            <FaSearch size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
