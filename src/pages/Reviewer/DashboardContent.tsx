import React, { useEffect } from "react";
import {
  Plus,
  Video,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { deleteInterview, getAllInterviews } from "../../api/interview";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Interview } from "../../types/interview";
import { handleLogout } from "../../utils/helpers";



interface DashboardCardProps {
  setCurrentView: (view: string) => void;
  setSelectedInterview: any;
  setIsEditMode: (isEdit: boolean) => void;
  submissions: any
}

const DashboardContent: React.FC<DashboardCardProps> = ({
  setCurrentView,
  setSelectedInterview,
  setIsEditMode,
  submissions
}) => {
  const {
    data: interviews,
    isLoading: loadingInterviews,
    isError: errorInterviews,
  } = useQuery<{ data: Interview[] }>({
    queryKey: ["interviews"],
    queryFn: getAllInterviews,
  });

  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);



  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInterview(id),
    onSuccess: () => {
      toast.success("Interview deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["interviews"] }); // Updated syntax
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete interview");
    },
  });

  if (loadingInterviews) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (errorInterviews) {
    toast.error("Failed to load dashboard data");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Error loading data</p>
      </div>
    );
  }

  const handleUpdate = (interview: Interview) => {
    setIsEditMode(true);
    setSelectedInterview(interview);
    setCurrentView("create");
  };

  const handleDelete = (interview: Interview) => {
    if (!interview._id) return;
    if (window.confirm(`Are you sure you want to delete "${interview.title}"?`)) {
      deleteMutation.mutate(interview._id);
    }
  };

  const interviewsData = interviews?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Sphereflix - Reviewer
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reviewer Dashboard
          </h2>
          <p className="text-gray-600">
            Manage interviews and review candidate submissions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Interviews
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {interviewsData.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {Array.isArray(submissions) ? submissions.length : submissions?.data?.length || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedInterview(null);
              setCurrentView("create");
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Interview</span>
          </button>
          <button
            onClick={() => setCurrentView("submissions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>View Submissions</span>
          </button>
        </div>

        {/* Interview List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Interviews
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interviewsData.length > 0 ? (
              interviewsData.map((interview: any) => (
                <div key={interview._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-1">
                        {interview.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {interview.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{interview?.questions.length} questions</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created: {new Date(interview.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                        onClick={() => handleUpdate(interview)}
                        title="Edit Interview"
                        disabled={deleteMutation.isPending}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-600 p-1 rounded transition-colors disabled:opacity-50"
                        onClick={() => handleDelete(interview)}
                        title="Delete Interview"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-lg">No interviews found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Create your first interview to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading state for delete operation */}
        {deleteMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">Deleting interview...</p>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default DashboardContent;