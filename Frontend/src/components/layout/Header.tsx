import { Link } from 'react-router-dom';
import { Newspaper, Plus, Info, Search, Activity, Vote } from 'lucide-react';
import ConnectWallet from '../wallet/ConnectWallet';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/70 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <Newspaper className="h-8 w-8 text-cyan-400 group-hover:rotate-6 transition-transform" />
            <span className="text-xl font-bold tracking-widest text-cyan-400">
              PROOFFEED
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm tracking-wider">
            <Link
              to="/dashboard"
              className="text-cyan-300/70 hover:text-cyan-400 transition"
            >
              HOME
            </Link>

            <Link
              to="/submit"
              className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-400 transition"
            >
              <Plus className="h-4 w-4" />
              <span>SUBMIT</span>
            </Link>

            <Link
              to="/search"
              className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-400 transition"
            >
              <Search className="h-4 w-4" />
              <span>SEARCH</span>
            </Link>

            <Link
              to="/performance"
              className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-400 transition"
            >
              <Activity className="h-4 w-4" />
              <span>STATS</span>
            </Link>

            <Link
              to="/governance"
              className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-400 transition"
            >
              <Vote className="h-4 w-4" />
              <span>GOVERN</span>
            </Link>

            <Link
              to="/about"
              className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-400 transition"
            >
              <Info className="h-4 w-4" />
              <span>ABOUT</span>
            </Link>
          </nav>

          {/* Wallet */}
          <div className="ml-4">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;