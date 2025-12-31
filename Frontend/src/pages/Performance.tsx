import { Suspense, lazy } from 'react';
import { Activity } from 'lucide-react';
import PerformanceDashboard from '../components/performance/PerformanceDashboard';

const Performance = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Monitor application performance, memory usage, caching statistics, and optimization metrics.
        </p>
      </div>

      <PerformanceDashboard />
    </div>
  );
};

export default Performance;