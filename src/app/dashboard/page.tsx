'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import SingerDashboard from '@/components/SingerDashboard';
import { ListnerDashboard } from '@/components/ListnerDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("ZenoRole");
    const isConnected = localStorage.getItem("ZenoConnected");

    if (isConnected !== "true" || !savedRole) {
      router.push('/login');
    } else {
      // Normalize to lowercase here to avoid matching errors
      setRole(savedRole.toLowerCase()); 
    }
  }, [router]);

  if (!role) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase">Dashboard</h1>
          <p className="text-zinc-500">Logged in as {role}</p>
        </header>

        {/* This check is now safer because role is definitely lowercase */}
        {role === 'singer' ? <SingerDashboard /> : <ListnerDashboard />}
        
      </main>
    </div>
  );
}