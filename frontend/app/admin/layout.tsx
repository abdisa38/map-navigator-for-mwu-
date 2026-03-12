"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role');

    if (!token || userRole !== 'admin') {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
            Dashboard
          </Link>
          <Link href="/admin/buildings" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
            Manage Buildings
          </Link>
           <Link href="/admin/users" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
            Manage Users
          </Link>
          <button 
            onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user_role');
                router.push('/login');
            }}
            className="w-full text-left block py-2.5 px-4 rounded hover:bg-red-700 transition mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto text-gray-900">
        {children}
      </main>
    </div>
  );
}
