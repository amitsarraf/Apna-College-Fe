import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Video, Clock, AlertCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getAllInterviews } from '../../api/interview';
import VideoInterviewUI from './VideoInterview';
import toast, { Toaster } from 'react-hot-toast';
import { handleLogout } from '../../utils/helpers';

const CandidateDashboard = () => {
  const { user } = useUser();
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const {
    data: interviews = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['interviews'],
    queryFn: getAllInterviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load interviews</h3>
          <p className="text-gray-600 mb-4">{(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedInterview) {
    return (
      <VideoInterviewUI
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />
    );
  }

  const handleClick = (interview: any) => {
    if (interview.attemptedBy.includes(user?._id)) {
      toast.error("Oops! It looks like you've already attempted this interview. Keep going and try another one!");
      return;
    }
    setSelectedInterview(interview);
  };




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Sphereflix</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Manage your video interviews and track your progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-md">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-3xl font-bold text-blue-600">{interviews.data.length}</p>
              </div>
              <Video className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Interviews</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.data.map((interview: any) => (
            <div
              key={interview._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{interview.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{interview.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{interview.questions?.length || 0} questions</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Created: {new Date(interview.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleClick(interview)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Start Interview
                </button>
              </div>
            </div>
          ))}
        </div>

        {interviews.data.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews available</h3>
            <p className="text-gray-600">Check back later for new interview opportunities.</p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default CandidateDashboard;
