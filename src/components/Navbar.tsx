"use client";
import React from 'react';

const Navbar = () => {
  return (
    <nav className="shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-yellow-500 text-xl capitalize font-bold">
          ts pokedex
        </div>
        <div className="relative w-1/2">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
          />
          <svg 
            className="w-6 h-6 text-gray-400 absolute left-3 top-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-4.35-4.35M3.65 11a7.35 7.35 0 1014.7 0 7.35 7.35 0 00-14.7 0z"
            />
          </svg>
        </div>
        <div className="text-white">
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
