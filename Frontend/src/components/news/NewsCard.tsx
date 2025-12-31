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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <VerdictBadge verdict={verdict} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Credibility Score:</span>
          <span className={`font-medium ${getConfidenceColor(dynamicScore.confidence)}`}>
            {dynamicScore.dynamicScore}/100
          </span>
        </div>
        <p className="text-xs text-gray-500">
          AI: {aiScore} • Community: {dynamicScore.communityScore}
        </p>
        <p className="text-sm text-gray-600">
          Total Votes: <span className="font-medium">{totalVotes}</span>
        </p>
        <p className="text-sm text-gray-600">
          Submitted by: {submitter}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View Source
        </a>
        <Link
          to={`/news/${id}`}
          className="btn-secondary text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;