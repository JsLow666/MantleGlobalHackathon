import { Verdict } from '../../utils/scoreCalculation';

interface VerdictBadgeProps {
  verdict: Verdict;
}

const VerdictBadge = ({ verdict }: VerdictBadgeProps) => {
  const getBadgeStyles = () => {
    switch (verdict) {
      case Verdict.Real:
        return 'bg-green-100 text-green-800';
      case Verdict.Fake:
        return 'bg-red-100 text-red-800';
      case Verdict.Uncertain:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerdictLabel = () => {
    switch (verdict) {
      case Verdict.Real:
        return 'Real';
      case Verdict.Fake:
        return 'Fake';
      case Verdict.Uncertain:
        return 'Uncertain';
      default:
        return 'Pending';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyles()}`}>
      {getVerdictLabel()}
    </span>
  );
};

export default VerdictBadge;