'use client';

import { useEffect, useState } from 'react';
import SingerDashboard from '@/components/SingerDashboard';
import ListnerDashboard from '@/components/ListnerDashboard';

export default function DashboardPage() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve role stored during Login/Signup
        const storedRole = localStorage.getItem("ZenoRole"); 
        setRole(storedRole);
    }, []);

    if (!role) return <div className="p-10 text-white">Loading Protocol...</div>;

    return (
        <main className="min-h-screen bg-black">
            {role === 'Singer' ? <SingerDashboard /> : <ListenerDashboard />}
        </main>
    );
}