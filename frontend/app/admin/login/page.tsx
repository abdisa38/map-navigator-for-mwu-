"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/login`, {
        university_id: universityId,
        password,
      });

      const { access_token, user } = response.data;

      if (user.role !== 'admin') {
          setError('Access Denied: You do not have administrator privileges.');
          return;
      }

      // Store token
      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', user.role);

      router.push('/admin');
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
             setError(err.response.data.message);
        } else if (err.response && err.response.data && err.response.data.errors) {
            setError(Object.values(err.response.data.errors).flat().join(', '));
        }
        else {
             setError('Login failed. Please check your credentials.');
        }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Admin Portal Login</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="universityId">
              Admin ID
            </label>
            <input
              id="universityId"
              type="text"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 transform hover:scale-[1.02]"
          >
            Login to Dashboard
          </button>
        </form>
         <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-white text-sm">Return to Home</a>
        </div>
      </div>
    </div>
  );
}
