import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/5 z-50">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center text-black transition-transform group-hover:rotate-12">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic text-white">ZENO</span>
      </div>
      
      <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
        <a href="/" className="hover:text-white transition">Home</a>
        <a href="/docs" className="hover:text-white transition">Docs</a>
        <a href="#" className="hover:text-white transition">Governance</a>
      </div>

      <ConnectButton />
    </nav>
  );
}