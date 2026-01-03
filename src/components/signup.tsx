'use client';

import React, { useState } from 'react';
import { useConnection } from 'wagmi';

export default function SignupForm() {
  const { address, status } = useConnection();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Singer' | 'Listener' | null>(null);

  const isConnected = status === 'connected';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !role) return;
    console.log("Account Initialization:", { address, username, password, role });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Wallet Identity</label>
          <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-green-500/80 truncate">
            {isConnected ? address : "Waiting for connection..."}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Alias</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Secret Key</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-green-500 transition-all text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-green-500 transition-colors"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Protocol Role</label>
          <div className="grid grid-cols-2 gap-3">
            <RoleButton active={role === 'Singer'} onClick={() => setRole('Singer')} label="Singer" />
            <RoleButton active={role === 'Listener'} onClick={() => setRole('Listener')} label="Listener" />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isConnected || !role}
          className="w-full mt-4 bg-white text-black py-4 rounded-full font-black uppercase italic tracking-tighter hover:bg-green-500 disabled:opacity-20 transition-all"
        >
          {isConnected ? "Register Account" : "Connect Wallet"}
        </button>
      </form>
    </div>
  );
}

function RoleButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-4 rounded-xl border transition-all ${
        active 
          ? 'border-green-500 bg-green-500/10 text-green-500' 
          : 'border-white/5 bg-black/20 text-zinc-500 hover:border-white/20'
      }`}
    >
      <span className="text-xs font-black uppercase italic tracking-tighter">{label}</span>
    </button>
  );
}