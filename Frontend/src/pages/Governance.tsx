import { Suspense, lazy } from 'react';
import { Vote } from 'lucide-react';
import GovernanceFeatures from '../components/governance/GovernanceFeatures';

const Governance = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Vote className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Governance</h1>
        </div>
        <p className="text-gray-600">
          Participate in platform governance, create proposals, and vote on important decisions that shape the future of ProofFeed.
        </p>
      </div>

      <GovernanceFeatures />
    </div>
  );
};

export default Governance;