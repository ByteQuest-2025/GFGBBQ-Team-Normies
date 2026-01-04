'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/users/login', formData);
      
      // Axios stores the body in .data
      if (res.data.success) {
        const { role, username } = res.data;

        localStorage.setItem("ZenoConnected", "true");
        localStorage.setItem("ZenoUser", username);
        localStorage.setItem("ZenoRole", role); 
        
        // Use window.location or router.push
        router.push('/dashboard');
      }
    } catch (err: any) { 
      // This catches the 400/500 errors from the route.ts
      const message = err.response?.data?.error || "Login Failed";
      alert(message);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full max-w-md mx-auto bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="Username" 
            required 
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" 
            onChange={e => setFormData({ ...formData, username: e.target.value })} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" 
            onChange={e => setFormData({ ...formData, password: e.target.value })} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black py-4 rounded-full font-black uppercase hover:bg-green-500 transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access Account"}
          </button>
        </form>
      </div>
    </div>
  );
}