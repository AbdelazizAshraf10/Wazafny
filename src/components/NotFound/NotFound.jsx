import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#D9D9D9]">
      {/* Container */}
      <div className="text-center space-y-6">
        {/* Main Heading */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
          404
        </h1>

        {/* Subheading */}
        <p className="text-2xl font-medium text-gray-800 dark:text-gray-400">
          Oops! Page Not Found.
        </p>

        {/* Description */}
        <p className="text-base text-gray-600 dark:text-gray-400">
          The page you are looking for might have been removed or doesn't exist.
        </p>

        {/* Button */}
        <div>
          <a
            href="/"
            className="inline-block px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}