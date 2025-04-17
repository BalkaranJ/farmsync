'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#3d4852] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#70c04e] rounded-md flex items-center justify-center text-white font-bold mr-2">
                F
              </div>
              <span className="text-xl font-bold text-white">FarmSync</span>
            </div>
            <p className="text-gray-300">
              Connecting the agricultural ecosystem through innovative technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/team" className="text-gray-300 hover:text-white">Our Team</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="/docs" className="text-gray-300 hover:text-white">Documentation</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-white">Support</Link></li>
              <li><Link href="/community" className="text-gray-300 hover:text-white">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/data-policy" className="text-gray-300 hover:text-white">Data Protection</Link></li>
              <li><Link href="/cookies" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} FarmSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}