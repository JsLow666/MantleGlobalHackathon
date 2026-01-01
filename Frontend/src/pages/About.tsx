const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About ProofFeed
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A community-driven platform that combines AI analysis and human
          consensus to help people better understand the credibility of online
          information.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        {/* What is ProofFeed */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What is ProofFeed?
            </h2>
            <p className="text-gray-700 mb-4">
              ProofFeed is built on the Mantle Network and provides an open,
              transparent way for users to evaluate news and public claims.
            </p>
            <p className="text-gray-700">
              Instead of relying on a single authority or black-box algorithms,
              ProofFeed combines AI-assisted analysis with community discussion
              to produce verifiable credibility signals.
            </p>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Core Principles
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• AI assists, not decides</li>
              <li>• Humans provide final judgment</li>
              <li>• Privacy is preserved by design</li>
              <li>• Results are transparent and auditable</li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Submit News",
                desc: "Users submit news articles or claims they want to evaluate.",
              },
              {
                step: "2",
                title: "AI Analysis",
                desc: "AI provides an initial credibility assessment and explanation.",
              },
              {
                step: "3",
                title: "Community Vote",
                desc: "Other users read, comment, and vote on credibility.",
              },
              {
                step: "4",
                title: "Credibility Signal",
                desc: "AI analysis and community input form a transparent result.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border rounded-xl p-6 bg-white hover:shadow-md transition"
              >
                <div className="text-sm font-semibold text-indigo-600 mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Tech */}
        <section className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Privacy by Design
            </h2>
            <p className="text-gray-700">
              ProofFeed uses privacy-preserving login technology that allows
              users to sign in with Google without exposing personal
              identity on-chain. This helps reduce spam and bot activity while
              protecting user privacy.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Built on Web3
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Mantle Network:</strong> Low-cost, scalable blockchain
                for recording votes and signals
              </li>
              <li>
                <strong>Zero-Knowledge Verification:</strong> Sybil-resistant
                participation without identity exposure
              </li>
              <li>
                <strong>AI Analysis:</strong> Probabilistic credibility
                assessments
              </li>
              <li>
                <strong>Smart Contracts:</strong> Transparent on-chain logic
              </li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-l-4 border-indigo-500 bg-indigo-50 p-6 rounded-r-xl">
          <h2 className="font-semibold text-gray-900 mb-2">
            Important Note
          </h2>
          <p className="text-gray-700">
            ProofFeed does not determine absolute truth or censor content. It
            provides credibility signals to help users make more informed
            decisions when consuming information online.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
