import NewsList from '../components/news/NewsList';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-cyan-300 overflow-hidden">
      {/* Ambient cyberpunk glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.12),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,0,255,0.10),_transparent_45%)]" />

      <div className="relative z-10 px-4 py-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest text-cyan-400 mb-6">
            PROOFFEED
          </h1>
          <p className="text-lg md:text-xl text-cyan-300/70 max-w-3xl mx-auto leading-relaxed">
            A decentralized cyber-verification network where AI intelligence and community
            consensus expose truth and eliminate misinformation on-chain.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="px-6 py-2 border border-cyan-500/40 rounded-full text-sm tracking-widest text-cyan-300 bg-black/60 backdrop-blur">
              POWERED BY MANTLE NETWORK
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="border border-cyan-500/20 rounded-2xl bg-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,255,0.15)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-widest text-cyan-400">
              LIVE INTEL FEED
            </h2>
            <span className="text-xs text-cyan-300/50 tracking-wider">
              COMMUNITY + AI VALIDATED
            </span>
          </div>

          <NewsList key="news-list" />
        </div>
      </div>
    </div>
  );
};

export default Home;