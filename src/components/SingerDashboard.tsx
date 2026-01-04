'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useConnection, useWriteContract, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { abi1, address1 } from '@/config/config';

export default function SingerDashboard() {
    // 1. useAccount remains the standard for v3
    const { address } = useConnection();
    
    // 2. Destructure exactly 'writeContractAsync' from the hook
    const { writeContractAsync, isPending: isMinting } = useWriteContract();
    
    const [mySongs, setMySongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ artist: '', song: '', audio: '' });

    // 3. Fetch current fee (v3 removed the 'watch' property from hooks)
    const { data: mintFee } = useReadContract({
        abi: abi1,
        address: address1 as `0x${string}`,
        functionName: 'getMintFeeInEth',
    });

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
        if (!address || loading || !mintFee) return;

        try {
            setLoading(true);

            // STEP 1: IPFS Upload via your API
            const uriRes = await axios.post('/api/songs', {
                ...formData, signerAddress: address, action: "getUri"
            });
            const metadataUri = uriRes.data.uri;

            // STEP 2: Wagmi v3 Contract Write
            // Ensure address1 is cast as `0x${string}` for TypeScript 5.7+
            const hash = await writeContractAsync({
                abi: abi1,
                address: address1 as `0x${string}`,
                functionName: 'mintSong',
                args: [metadataUri],
                value: BigInt(mintFee.toString()),
            });

            // STEP 3: MongoDB Save
            await axios.post('/api/songs', {
                ...formData, 
                lighthouseUri: metadataUri, 
                mintTxHash: hash, 
                signerAddress: address, 
                action: "save"
            });

            alert("Mint Successful!");
            fetchMySongs();
        } catch (err: any) {
            console.error(err);
            alert(err.shortMessage || err.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-green-500">Artist Portal</h2>
                    {typeof mintFee === 'bigint' && (
    <span className="text-xs font-bold text-zinc-400">
        Fee: {formatEther(mintFee)} ETH
    </span>
)}
                </div>
                <form onSubmit={handleMintAndPublish} className="space-y-4">
                    <input placeholder="Artist" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, artist: e.target.value})} required />
                    <input placeholder="Song Title" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, song: e.target.value})} required />
                    <input placeholder="Audio URL" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-green-500" 
                        onChange={e => setFormData({...formData, audio: e.target.value})} required />
                    <button disabled={loading || isMinting} className="w-full bg-white text-black py-4 rounded-full font-black uppercase hover:bg-green-500 transition-all">
                        {loading || isMinting ? "Minting..." : "Mint Music NFT"}
                    </button>
                </form>
            </section>

            <section className="bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-zinc-500">Your Catalog</h2>
                <div className="space-y-3">
                    {mySongs.map((song: any) => (
                        <div key={song._id} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{song.songName}</h3>
                                <p className="text-[10px] text-zinc-500 uppercase">{song.artistName}</p>
                            </div>
                            <p className="text-[9px] font-mono text-zinc-700">TX: {song.mintTxHash?.slice(0, 10)}...</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}