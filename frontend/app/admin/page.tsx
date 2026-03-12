"use client";

import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
      buildings_count: 0,
      users_count: 0,
      admins_count: 0
  });

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="text-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Buildings Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Buildings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.buildings_count}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Registered Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users_count}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
           <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Administrators</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.admins_count}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <a href="/admin/buildings" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </span>
                  <span className="font-medium text-gray-700">Add Building</span>
               </a>
          </div>
       </div>
    </div>
  );
}
