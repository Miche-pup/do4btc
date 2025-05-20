// components/Layout.tsx
'use client'; // If you plan to add any client-side interactivity to the layout later

import Link from 'next/link';
import React from 'react';

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  // Placeholder for actual idea submission toggle logic
  const handleAddIdeaClick = () => {
    console.log('Add Your Idea button clicked');
    // Later, this will open a modal or navigate
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black/50 backdrop-blur-sm py-3 sm:py-4 sticky top-0 z-50 border-b border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors">
            Bitcoin Value Catalyst
          </Link>
          <button
            onClick={handleAddIdeaClick}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            aria-label="Add Your Idea"
          >
            Add Your Idea
          </button>
        </div>
      </header>

      <main className="flex-grow w-full container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-sm py-6 border-t border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} - We, not I. Ask not what Bitcoin can do for you...
          </p>
        </div>
      </footer>
    </div>
  );
}