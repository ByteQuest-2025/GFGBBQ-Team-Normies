'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useConnection, useWriteContract } from 'wagmi';
import { abi1,address1 } from '@/config/config';
export default function SingerDashboard() {
    const { address } = useConnection();
    const { writeContractAsync } = useWriteContract();
    
    const [mySongs, setMySongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ artist: '', song: '', audio: '' });

    useEffect(() => {
        if (address) fetchMySongs();
    }, [address]);

    const fetchMySongs = async () => {
        try {
            const res = await axios.get(`/api/songs?address=${address}`);
            setMySongs(res.data.songs);
        } catch (err) { console.error("Fetch error", err); }
    };

    const handleMintAndPublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || loading) return;

        try {
            setLoading(true);

            // 1. Get Lighthouse URI
            const uriRes = await axios.post('/api/songs', {
                ...formData, signerAddress: address, action: "getUri"
            });
            const metadataUri = uriRes.data.uri;

            // 2. Mint on Smart Contract
            const tx = await writeContractAsync({
                abi: abi1,
                address: address1,
                functionName: 'mintMasterToken',
                args: [address, metadataUri],
            });

            // 3. Save to MongoDB
            await axios.post('/api/songs', {
                ...formData, lighthouseUri: metadataUri, txHash: tx, signerAddress: address, action: "save"
            });

            alert("Master Token Minted!");
            fetchMySongs(); // Refresh list
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT: MINTING SECTION */}
            <section className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-green-500">Initialize Master</h2>
                <form onSubmit={handleMintAndPublish} className="space-y-4">
                    <input placeholder="Artist Name" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, artist: e.target.value})} required />
                    <input placeholder="Song Name" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, song: e.target.value})} required />
                    <input placeholder="Audio URL (IPFS/Cloud)" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, audio: e.target.value})} required />
                    <button disabled={loading} className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest hover:bg-green-500 transition-all">
                        {loading ? "Processing..." : "Mint & Publish"}
                    </button>
                </form>
            </section>

            {/* RIGHT: PUBLISHED SONGS LIST */}
            <section>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-zinc-400">Your Catalog</h2>
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                    {mySongs.length === 0 ? (
                        <p className="text-zinc-600 italic">No assets published yet.</p>
                    ) : (
                        mySongs.map((song: any) => (
                            <div key={song._id} className="bg-zinc-900 border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-green-500/30 transition-all">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{song.songName}</h3>
                                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{song.artistName}</p>
                                </div>
                                <div className="text-right">
                                    <a href={song.lighthouseUri} target="_blank" className="text-[10px] text-green-500 font-mono hover:underline">VIEW METADATA</a>
                                    <p className="text-[9px] text-zinc-700 mt-1 uppercase">TX: {song.mintTxHash.substring(0, 10)}...</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}