'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Song {
  _id: string;
  songName: string;
  artistName: string;
  audioUrl: string;
  lighthouseUri: string;
}

export const ListnerDashboard = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('/api/songs/get-all');
        if (res.data.success) {
          setSongs(res.data.songs);
        }
      } catch (err) {
        console.error("Error fetching tracks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-500">
          Available Tracks
        </h2>
        <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
          {songs.length} Songs found
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div 
            key={song._id} 
            className="group relative bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] hover:bg-zinc-800/60 transition-all duration-300"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                    {song.songName}
                  </h3>
                  <p className="text-zinc-500 font-medium">@{song.artistName}</p>
                </div>
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="pt-2">
                <audio 
                  controls 
                  className="w-full h-10 custom-audio-player"
                >
                  <source src={song.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="flex gap-2 mt-2">
                <a 
                  href={song.audioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all border border-white/5"
                >
                  DOWNLOAD
                </a>
                <a 
                  href={song.lighthouseUri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all border border-white/5"
                >
                  METADATA
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-zinc-500 font-medium">The Zeno library is currently empty.</p>
        </div>
      )}
    </div>
  );
};