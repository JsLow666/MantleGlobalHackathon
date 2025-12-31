const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About ProofFeed</h1>

      <div className="prose prose-lg">
        <p>
          ProofFeed is a decentralized news validation platform built on the Mantle Network.
          It combines artificial intelligence with community consensus to determine the credibility
          of news articles.
        </p>

        <h2>How it works</h2>
        <ol>
          <li>Users submit news articles with AI analysis</li>
          <li>The community votes on the article's credibility</li>
          <li>A consensus verdict is reached combining AI and human input</li>
          <li>All data is stored on-chain for transparency</li>
        </ol>

        <h2>Technology</h2>
        <ul>
          <li><strong>Mantle Network:</strong> Layer 2 scaling solution for Ethereum</li>
          <li><strong>ZK Verification:</strong> Privacy-preserving user authentication</li>
          <li><strong>AI Analysis:</strong> Automated fact-checking using Claude AI</li>
          <li><strong>Smart Contracts:</strong> Solidity contracts for decentralized logic</li>
        </ul>
      </div>
    </div>
  );
};

export default About;