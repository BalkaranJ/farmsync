'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // For demo purposes, we'll just decode the token
    // In a real app, you should validate the token on the server
    try {
      // This is a simplified approach - in a real app, verify the token properly
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.id,
        email: payload.email,
        userType: payload.userType
      });
    } catch (error) {
      console.error('Token error:', error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#70c04e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 bg-[#70c04e] rounded-md flex items-center justify-center text-white font-bold mr-2">
              F
            </div>
            <span className="text-xl font-bold text-[#70c04e]">FarmSync</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.email}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome to your Dashboard
          </h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Account</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User Type:</strong> {user?.userType === 'FARMER' ? 'Farmer' : 'Researcher/Policymaker'}</p>
              <p><strong>Account ID:</strong> {user?.id}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {user?.userType === 'FARMER' ? 'Farm Management' : 'Research Portal'}
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">
                {user?.userType === 'FARMER' 
                  ? 'Manage your farm data, track crops, and connect with researchers.' 
                  : 'Access agricultural data, publish research, and connect with farmers.'}
              </p>
              <div className="mt-4">
                <button className="btn btn-primary">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}