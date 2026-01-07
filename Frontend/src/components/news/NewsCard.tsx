import { Link } from 'react-router-dom';
import { VoteCounts } from '../../hooks/useContracts';
import { Verdict, DynamicScoreResult, getConfidenceColor } from '../../utils/scoreCalculation';
import VerdictBadge from '../voting/VerdictBadge';

interface NewsCardProps {
  id: number;
  title: string;
  sourceUrl: string;
  aiScore: number;
  dynamicScore: DynamicScoreResult;
  submitter: string;
  voteCounts: VoteCounts;
  verdict: Verdict;
}

const NewsCard = ({
  id,
  title,
  sourceUrl,
  aiScore,
  dynamicScore,
  submitter,
  voteCounts,
  verdict,
}: NewsCardProps) => {
  const totalVotes = voteCounts.real + voteCounts.fake + voteCounts.uncertain;

  return (
    <div className="relative rounded-xl border border-cyan-500/25 bg-black/60 backdrop-blur-xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.12)] hover:shadow-[0_0_45px_rgba(0,255,255,0.25)] transition-all">
      {/* Glow accent */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

      <div className="relative z-10">
        {/* Title + Verdict */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold tracking-wide text-cyan-100 line-clamp-2">
            {title}
          </h3>
          <VerdictBadge verdict={verdict} />
        </div>

        {/* Scores */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cyan-300/70 tracking-wide">CREDIBILITY</span>
            <span className={`font-bold tracking-wider ${getConfidenceColor(dynamicScore.confidence)}`}>
              {dynamicScore.dynamicScore}/100
            </span>
          </div>

          <div className="text-xs text-cyan-300/50 tracking-wide">
            AI SCORE: <span className="text-cyan-300">{aiScore}</span> • COMMUNITY: <span className="text-cyan-300">{dynamicScore.communityScore}</span>
          </div>

          <div className="flex justify-between text-xs text-cyan-300/60">
            <span>VOTES</span>
            <span className="font-mono">{totalVotes}</span>
          </div>

          <div className="flex justify-between text-xs text-cyan-300/60">
            <span>SUBMITTER</span>
            <span className="font-mono">{submitter}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest text-cyan-400 hover:text-cyan-300 transition"
          >
            VIEW SOURCE
          </a>
          <Link
            to={`/news/${id}`}
            className="px-3 py-1.5 border border-cyan-500/40 rounded-md text-xs tracking-widest text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            DETAILS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
