import SubmitNewsForm from '../components/news/SubmitNewsForm';

const Submit = () => {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 blur-3xl" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-4">
            Submit News for Validation
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Publish a news article on-chain and let AI intelligence and the
            ProofFeed community determine its credibility.
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <SubmitNewsForm />
        </div>
      </div>
    </div>
  );
};

export default Submit;
