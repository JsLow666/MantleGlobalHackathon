import { Suspense, lazy } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import AdvancedSearch from '../components/search/AdvancedSearch';

const Search = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SearchIcon className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
        </div>
        <p className="text-gray-600">
          Find news articles using advanced filters, sorting options, and comprehensive search capabilities.
        </p>
      </div>

      <AdvancedSearch />
    </div>
  );
};

export default Search;