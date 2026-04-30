import React from 'react';
import {Button} from '../button';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/home/upbeat.png"
              alt="UpBeat Africa"
              width={520}
              height={520}
              className="h-16 w-16 object-cover"
            />
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-primary transition-colors font-medium">
              Templates
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-primary transition-colors font-medium">
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary font-medium">
              Log in
            </button>
            <button className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
