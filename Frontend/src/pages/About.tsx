const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6
                       bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400
                       bg-clip-text text-transparent">
          About ProofFeed
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A community-driven platform combining AI analysis and human consensus
          to produce transparent credibility signals for online information.
        </p>
      </div>

      {/* What is ProofFeed */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            What is ProofFeed?
          </h2>
          <p className="text-gray-400 mb-4">
            ProofFeed is built on the Mantle Network and provides an open,
            decentralized way to evaluate news and public claims.
          </p>
          <p className="text-gray-400">
            Instead of relying on a single authority or opaque algorithms,
            ProofFeed combines AI-assisted analysis with community-driven
            verification.
          </p>
        </div>

        <div
          className="bg-black/60 backdrop-blur-xl border border-purple-500/20
                     rounded-2xl p-6
                     shadow-[0_0_25px_rgba(168,85,247,0.12)]"
        >
          <h3 className="font-semibold text-purple-400 mb-4">
            Core Principles
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• AI assists, not decides</li>
            <li>• Humans provide final judgment</li>
            <li>• Privacy preserved by design</li>
            <li>• Results are transparent & auditable</li>
          </ul>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Submit News",
              desc: "Users submit news articles or claims for evaluation.",
            },
            {
              step: "02",
              title: "AI Analysis",
              desc: "AI generates an initial credibility score and rationale.",
            },
            {
              step: "03",
              title: "Community Vote",
              desc: "Users discuss and vote on credibility.",
            },
            {
              step: "04",
              title: "Credibility Signal",
              desc: "AI + community input form a transparent result.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-black/60 backdrop-blur-xl border border-cyan-500/20
                         rounded-2xl p-6
                         hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                         transition-all"
            >
              <div className="text-xs font-mono text-cyan-400 mb-2">
                STEP {item.step}
              </div>
              <h3 className="font-semibold text-gray-200 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Tech */}
      <section className="grid md:grid-cols-2 gap-10">
        <div
          className="bg-black/60 backdrop-blur-xl border border-green-500/20
                     rounded-2xl p-8
                     shadow-[0_0_25px_rgba(34,197,94,0.12)]"
        >
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Privacy by Design
          </h2>
          <p className="text-gray-400">
            ProofFeed uses privacy-preserving login (zk-based) allowing users
            to authenticate via Google without exposing identity on-chain.
            This reduces bots while protecting privacy.
          </p>
        </div>

        <div
          className="bg-black/60 backdrop-blur-xl border border-purple-500/20
                     rounded-2xl p-8
                     shadow-[0_0_25px_rgba(168,85,247,0.12)]"
        >
          <h2 className="text-xl font-bold text-purple-400 mb-4">
            Built on Web3
          </h2>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <span className="text-cyan-400 font-semibold">Mantle Network:</span>{" "}
              Low-cost scalable blockchain
            </li>
            <li>
              <span className="text-cyan-400 font-semibold">ZK Verification:</span>{" "}
              Sybil resistance without identity exposure
            </li>
            <li>
              <span className="text-cyan-400 font-semibold">AI Analysis:</span>{" "}
              Probabilistic credibility scoring
            </li>
            <li>
              <span className="text-cyan-400 font-semibold">Smart Contracts:</span>{" "}
              Transparent on-chain logic
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <section
        className="bg-black/70 border-l-4 border-yellow-400
                   rounded-xl p-6
                   shadow-[0_0_20px_rgba(234,179,8,0.15)]"
      >
        <h2 className="font-semibold text-yellow-400 mb-2">
          Important Note
        </h2>
        <p className="text-gray-400 text-sm">
          ProofFeed does not determine absolute truth or censor content.
          It provides credibility signals to help users make informed
          decisions when consuming information online.
        </p>
      </section>
    </div>
  );
};

export default About;
