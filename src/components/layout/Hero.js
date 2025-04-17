'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-16 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d4852] leading-tight mb-4">
              Connecting Farmers, Researchers, and Policymakers
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              FarmSync is a revolutionary platform that connects farmers with researchers and policymakers to optimize agricultural practices, share data, and collaborate for a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn btn-primary btn-large text-center">
                Get Started
              </Link>
              <Link href="#features" className="btn btn-outline btn-large text-center">
                Learn More
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/agriculture.jpg" 
                alt="Farming Technology" 
                width={800} 
                height={600} 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}