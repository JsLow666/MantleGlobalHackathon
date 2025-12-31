import { Suspense, lazy } from 'react';
import { User } from 'lucide-react';

const UserProfile = lazy(() => import('../components/profile/UserProfile'));

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        </div>
        <p className="text-gray-600">
          View your voting history, reputation score, achievements, and platform statistics.
        </p>
      </div>

      <Suspense fallback={
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <UserProfile />
      </Suspense>
    </div>
  );
};

export default Profile;