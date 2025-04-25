'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../../lib/validationSchema';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit,
    watch, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'FARMER',
      agreedToTerms: false
    }
  });

  const userType = watch('userType');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType: data.userType,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create account');
      }

      // Redirect to login page on successful signup
      router.push('/login?signup=success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container max-w-[800px]">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500">
            <option>English (United States)</option>
            <option>Español</option>
            <option>Français</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Already have an account?</span>
          <Link href="/login" className="btn btn-outline btn-sm">
            Sign in
          </Link>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
      <Link href="/" className="flex flex-col items-center">
          <Image 
            src="/images/farmsync.png" 
            alt="Farmsync" 
            width={100} 
            height={15} 
            className="w-full h-auto"
          />
        </Link>
      </div>
      
      <h1 className="auth-title">Create an account</h1>
      <p className="auth-subtitle">Connect with farmers, researchers, and policymakers</p>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="form-label mb-0">Password</label>
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="text-sm text-[#70c04e] font-medium"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label mb-3">I am a:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label 
              className={`flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                userType === 'FARMER' 
                  ? 'border-[#70c04e] bg-[#f0f9eb]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="FARMER"
                className="sr-only"
                {...register('userType')}
              />
              <div className="text-4xl mb-2">🌾</div>
              <span className="text-lg font-medium mb-1">Farmer</span>
              <span className="text-sm text-gray-500 text-center">Track your farm data and connect with researchers</span>
              {userType === 'FARMER' && (
                <div className="mt-3 bg-[#70c04e] text-white text-xs font-medium px-2 py-1 rounded-full">Selected</div>
              )}
            </label>
            
            <label 
              className={`flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                userType === 'RESEARCHER' 
                  ? 'border-[#70c04e] bg-[#f0f9eb]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="RESEARCHER"
                className="sr-only"
                {...register('userType')}
              />
              <div className="text-4xl mb-2">🔬</div>
              <span className="text-lg font-medium mb-1">Researcher/Policymaker</span>
              <span className="text-sm text-gray-500 text-center">Access agricultural data and collaborate</span>
              {userType === 'RESEARCHER' && (
                <div className="mt-3 bg-[#70c04e] text-white text-xs font-medium px-2 py-1 rounded-full">Selected</div>
              )}
            </label>
          </div>
          {errors.userType && (
            <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 mr-3"
              {...register('agreedToTerms')}
            />
            <span className="text-sm text-gray-600">
              By creating an account, I agree to our{' '}
              <Link href="/terms" className="text-[#70c04e] hover:underline">
                Terms of use
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#70c04e] hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms.message}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="w-full btn btn-primary py-3"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      
      <div className="divider">
        <span className="divider-text">OR</span>
      </div>
      
      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-3 btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-3 btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
          </svg>
          Continue with LinkedIn
        </button>
      </div>
    </div>
  );
}