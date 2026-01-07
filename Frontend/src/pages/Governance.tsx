import { Suspense, lazy } from 'react';
import { Vote } from 'lucide-react';
import GovernanceFeatures from '../components/governance/GovernanceFeatures';

const Governance = () => {
  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Vote className="h-8 w-8 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Governance
          </h1>
        </div>

        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Participate in decentralized governance, create proposals, and vote on
          decisions that shape the future of <span className="text-cyan-400">ProofFeed</span>.
        </p>
      </div>

      {/* Content */}
      <div
        className="bg-black/60 backdrop-blur-xl border border-purple-500/20
                   rounded-2xl p-6
                   shadow-[0_0_40px_rgba(168,85,247,0.08)]"
      >
        <GovernanceFeatures />
      </div>
    </div>
  );
};

export default Governance;
