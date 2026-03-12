"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    university_id: string;
    role: string;
    email: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // This needs a backend endpoint for listing users, which typically requires admin rights.
    // For now, we'll mock it or try to fetch if an endpoint existed.
    useEffect(() => {
        // Implement user fetching here
        setLoading(false);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <p>User management interface goes here.</p>
        </div>
    );
}
