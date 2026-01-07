const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-cyan-500/20 bg-black/80 backdrop-blur-xl overflow-hidden">
      {/* Neon glow accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="text-center space-y-3">
          <p className="text-sm tracking-widest text-cyan-300/80">
            PROOFFEED — DECENTRALIZED NEWS VERIFICATION
          </p>
          <p className="text-xs tracking-wider text-cyan-400">
            POWERED BY MANTLE NETWORK
          </p>
          <p className="text-[11px] text-cyan-300/40">
            Built for Mantle Global Hackathon 2025
          </p>

          {/* Divider line */}
          <div className="mt-4 flex justify-center">
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          </div>

          <p className="text-[10px] text-cyan-300/30 tracking-widest mt-2">
            TRUST • TRANSPARENCY • CONSENSUS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;