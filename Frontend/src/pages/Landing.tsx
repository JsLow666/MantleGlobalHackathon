import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to ProofFeed
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A decentralized platform for news validation using AI and community consensus on the Mantle Network.
            Ensure the authenticity of news through zero-knowledge proofs and blockchain technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced AI algorithms analyze news content for accuracy and bias detection.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-gray-600">
              Privacy-preserving verification ensures credibility without revealing sensitive data.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Decentralized Consensus</h3>
            <p className="text-gray-600">
              Community-driven validation through blockchain-based voting and consensus.
            </p>
          </div>
        </div>

        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;