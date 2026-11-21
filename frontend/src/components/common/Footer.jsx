import React from 'react';
import { Car, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Car className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">
              Campus Carpool Finder
            </span>
          </div>

          <p className="text-xs text-gray-500 flex items-center">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> by B.Tech CSE Team for Agile Software Development Lab
          </p>

          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
