
import Header from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      <Header />

      <header className="px-6 pt-32 pb-40 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 blur-[120px] rounded-full -z-10" />
        
        <h1 className="text-7xl md:text-[120px] font-black leading-[0.85] tracking-tighter mb-8">
          OWN YOUR <br />
          <span className="text-green-500">SOUND.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium">
          The first decentralized intelligence platform for music rights, 
          built for the next generation of creators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a className="rounded-xl bg-amber-50 text-black p-4" href="/dashboard"> Get Started</a>
        </div>
      </header>

      <footer className="py-12 flex flex-col items-center gap-4 opacity-40">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
          Zeno // Crafted with love by cats
        </p>
      </footer>
    </div>
  );
}