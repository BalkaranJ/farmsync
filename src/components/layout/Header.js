'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/farmsync.png" 
            alt="Farmsync" 
            width={100} 
            height={15} 
            className="w-full h-auto"
            />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/" className="text-gray-700 hover:text-[#70c04e] font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-gray-700 hover:text-[#70c04e] font-medium">
                Features
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-[#70c04e] font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-[#70c04e] font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          <div className="flex flex-col space-y-1.5">
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <div className="container mx-auto px-4">
            <ul className="space-y-4">
              <li>
                <Link href="/" className="block text-gray-700 hover:text-[#70c04e] font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="block text-gray-700 hover:text-[#70c04e] font-medium">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="block text-gray-700 hover:text-[#70c04e] font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block text-gray-700 hover:text-[#70c04e] font-medium">
                  Contact
                </Link>
              </li>
              <li className="pt-4 border-t border-gray-200">
                <Link href="/login" className="block w-full py-2 text-center text-gray-700 hover:text-[#70c04e] font-medium">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="block w-full py-2 text-center bg-[#70c04e] text-white rounded-md hover:bg-[#5aa03c]">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}