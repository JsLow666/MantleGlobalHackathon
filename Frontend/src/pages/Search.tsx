import { Search as SearchIcon } from 'lucide-react';
import AdvancedSearch from '../components/search/AdvancedSearch';

const Search = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-10 bg-black/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-400/30">
            <SearchIcon className="h-7 w-7 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight">
            Advanced Search
          </h1>
        </div>

        <p className="text-gray-400 max-w-2xl">
          Discover verified and disputed news using advanced filters, on-chain
          data, AI credibility scores, and community-driven verdicts.
        </p>
      </div>

      {/* Search Module */}
      <div className="bg-black/30 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6">
        <AdvancedSearch />
      </div>
    </div>
  );
};

export default Search;
