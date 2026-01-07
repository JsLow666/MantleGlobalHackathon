import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#00f5ff22,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_#0ff1,_transparent_1px),linear-gradient(to_bottom,_#0ff1,_transparent_1px)] bg-[size:40px_40px] opacity-10" />

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 
            bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            ProofFeed
          </h1>

          <p className="text-cyan-300 uppercase tracking-widest text-sm mb-4">
            Trust the Signal. Eliminate the Noise.
          </p>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A <span className="text-cyan-400 font-semibold">decentralized news verification protocol </span> 
            powered by AI, zero-knowledge proofs, and community consensus on the Mantle Network.
            <br />
            <span className="text-purple-400">Truth, verified on-chain.</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          <div className="backdrop-blur-md bg-white/5 border border-cyan-400/20 p-8 rounded-xl 
            shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:shadow-cyan-400/30 transition duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-cyan-300">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-400">
              Neural models analyze credibility, bias, and manipulation patterns in real time.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-purple-400/20 p-8 rounded-xl 
            shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-purple-400/30 transition duration-300">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-purple-300">
              Zero-Knowledge Proofs
            </h3>
            <p className="text-gray-400">
              Verify authenticity without exposing sources, data, or personal information.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-blue-400/20 p-8 rounded-xl 
            shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-blue-400/30 transition duration-300">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-3 text-blue-300">
              Decentralized Consensus
            </h3>
            <p className="text-gray-400">
              Community-driven validation secured by blockchain voting and immutable records.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleGetStarted}
            className="relative px-10 py-4 text-lg font-bold rounded-lg 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              hover:from-cyan-400 hover:to-purple-600
              transition-all duration-300
              shadow-[0_0_25px_rgba(0,255,255,0.4)]
              hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            Enter the Network
          </button>

          <p className="text-sm text-gray-500">
            Powered by AI • Secured by Cryptography • Governed by Community
          </p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
