import { Link } from 'react-router-dom';
import { Newspaper, Plus, Info, BarChart3, Search, Activity, Vote } from 'lucide-react';
import ConnectWallet from '../wallet/ConnectWallet';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ProofFeed</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/submit" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Submit News</span>
            </Link>
            <Link to="/search" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            <Link to="/performance" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Activity className="h-4 w-4" />
              <span>Performance</span>
            </Link>
            <Link to="/governance" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Vote className="h-4 w-4" />
              <span>Governance</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
          </nav>

          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;