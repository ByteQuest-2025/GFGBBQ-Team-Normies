'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { abi2, address2, abi1, address1 } from '@/config/config';

export const ListnerDashboard = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSong, setActiveSong] = useState<any>(null);
  const [view, setView] = useState<'market' | 'collection'>('market');

  const { data: ethPrice } = useReadContract({
    abi: abi1,
    address: address1 as `0x${string}`,
    functionName: 'getLatestEthPrice',
  });

  useEffect(() => {
    axios.get('/api/songs/get-all').then(res => {
      if (res.data?.success) {
        const data = res.data.songs.map((s: any) => ({
          ...s,
          cid: s.tokenId || s.songId || "0" 
        }));
        setSongs(data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const buyLicense = async (type: number) => {
    if (!activeSong || !address || !ethPrice || isPending) return;
    try {
      const usdAmount = type === 0 ? BigInt(1e18) : BigInt(20e18);
      const val = (usdAmount * BigInt(1e18)) / BigInt(ethPrice as any);

      const hash = await writeContractAsync({
        abi: abi2,
        address: address2 as `0x${string}`,
        functionName: 'mintUsageRight',
        args: [BigInt(activeSong.cid), type, activeSong.lighthouseUri || ""],
        value: val,
      });
      alert(`Tx Hash: ${hash}`);
      setActiveSong(null);
    } catch (err: any) {
      alert(err.shortMessage || "Transaction Refused");
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-blue-500">BOOTING ZENO...</div>;

  return (
    <div className="p-8 space-y-10 bg-black min-h-screen text-white">
      {/* TAB NAVIGATION */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic uppercase text-blue-500 tracking-tighter">
            {view === 'market' ? 'Marketplace' : 'My Collection'}
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Powered by Zeno Master Contract</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-full border border-white/5">
          <button 
            onClick={() => setView('market')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase transition-all ${view === 'market' ? 'bg-blue-500 text-black' : 'text-zinc-500'}`}
          >
            Explore
          </button>
          <button 
            onClick={() => setView('collection')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase transition-all ${view === 'collection' ? 'bg-blue-500 text-black' : 'text-zinc-500'}`}
          >
            Library
          </button>
        </div>
      </div>
      
      {/* GRID VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {songs.map((s) => (
          <SongCard 
            key={s._id} 
            song={s} 
            user={address} 
            onOpen={() => setActiveSong(s)} 
            onlyOwned={view === 'collection'}
          />
        ))}
      </div>

      {/* PURCHASE MODAL */}
      {activeSong && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 p-10 rounded-[2rem] border border-white/10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black uppercase mb-8 italic text-center">
              {isPending ? "Confirming..." : `License: ${activeSong.songName}`}
            </h3>
            <div className="space-y-4">
              <button 
                disabled={isPending}
                onClick={() => buyLicense(0)} 
                className="w-full p-4 bg-blue-600 rounded-xl font-bold uppercase disabled:opacity-50 hover:bg-blue-500 transition-all"
              >
                Standard — $1
              </button>
              <button 
                disabled={isPending}
                onClick={() => buyLicense(1)} 
                className="w-full p-4 bg-green-600 rounded-xl font-bold uppercase disabled:opacity-50 hover:bg-green-500 transition-all"
              >
                Enterprise — $20
              </button>
            </div>
            {!isPending && (
              <button onClick={() => setActiveSong(null)} className="w-full mt-6 text-zinc-600 font-bold uppercase text-xs">Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SongCard = ({ song, user, onOpen, onlyOwned }: any) => {
  const canRead = user && song?.cid && !isNaN(Number(song.cid));

  const { data: status } = useReadContract({
    abi: abi2,
    address: address2 as `0x${string}`,
    functionName: 'checkLicense',
    args: canRead ? [user, BigInt(song.cid)] : undefined,
    query: { enabled: !!canRead }
  });

  const [isBought, usageType] = Array.isArray(status) ? (status as [boolean, number]) : [false, 0];

  // Logic: In 'Library' view, hide songs the user hasn't bought
  if (onlyOwned && !isBought) return null;

  return (
    <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between hover:border-blue-500/50 transition-all relative overflow-hidden group">
      {isBought && (
        <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase rounded-bl-xl ${Number(usageType) === 1 ? 'bg-green-500 text-black' : 'bg-blue-500 text-white'}`}>
          {Number(usageType) === 1 ? 'Enterprise' : 'Standard'}
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-2xl font-black leading-tight">{song.songName}</h4>
          <a href={song.lighthouseUri} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">@{song.artistName}</p>
      </div>

      <div className="mt-8">
        {isBought ? (
          <a 
            href={song.audioUrl} 
            download 
            className="block w-full bg-white text-black py-4 rounded-full font-black text-center uppercase text-xs hover:bg-zinc-200 transition-colors"
          >
            Download Track
          </a>
        ) : (
          <button 
            onClick={onOpen} 
            className="w-full bg-blue-500 text-black py-4 rounded-full font-black uppercase hover:bg-white transition-colors text-xs"
          >
            Get License
          </button>
        )}
      </div>
    </div>
  );
};