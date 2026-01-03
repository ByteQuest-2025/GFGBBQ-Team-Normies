import Header from "@/components/header";
const RoleCard = ({ title, subtitle, icon, points }: { title: string, subtitle: string, icon: React.ReactNode, points: string[] }) => (
  <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-10 hover:border-green-500/30 transition-colors">
    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-black mb-8">
      {icon}
    </div>
    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">{title}</h3>
    <p className="text-green-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">{subtitle}</p>
    <ul className="space-y-4">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
          <span className="text-green-500">•</span>
          {point}
        </li>
      ))}
    </ul>
  </div>
);

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-20">
        <header className="mb-16">
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Documentation</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Ecosystem <span className="text-green-500">Roles.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard 
            title="Singer" 
            subtitle="Creator & Rights Holder" 
            icon={<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
            points={[
              "Mint master recordings as unique on-chain assets",
              "Configure automated royalty splits for collaborators",
              "Access real-time analytics on global streaming data",
              "License tracks directly to content creators via smart contracts"
            ]}
          />
          <RoleCard 
            title="Listener" 
            subtitle="Supporter & Curator" 
            icon={<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            points={[
              "Stream high-fidelity audio directly from the protocol",
              "Earn $ZENO rewards for early discovery of trending artists",
              "Purchase limited edition fractional ownership in tracks",
              "Vote on community-curated playlists and spotlights"
            ]}
          />
        </div>
      </main>

      <footer className="py-12 flex flex-col items-center gap-4 opacity-40">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
          Zeno // Crafted with love by cats
        </p>
      </footer>
    </div>
  );
}