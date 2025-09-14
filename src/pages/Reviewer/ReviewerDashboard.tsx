import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardContent from './DashboardContent';
import CreateInterview from './CreateInterview';
import Submissions from './Submissions';
import { useUser } from "../../context/UserContext";
import { ReviewData } from './SubmissionCard';
import { SubmissionPayload } from '../../types/interview';
import { getAllSubmission, updateSubmission } from '../../api/submission';


interface Interview {
  _id: string;
  title: string;
  description: string;
  questions: string[];
  createdAt: string;
}

const ReviewerDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useUser();
  const queryClient = useQueryClient();

  const [newInterview, setNewInterview] = useState({
    title: '',
    description: '',
    questions: ['']
  });

  const [reviewData, setReviewData] = useState<ReviewData>({
    score: '',
    comments: ''
  });

  const {
    data: submissions,
    isLoading: loadingSubmissions,
    isError: errorSubmissions,
  } = useQuery<{ data: SubmissionPayload[] }>({
    queryKey: ["submissions"],
    queryFn: getAllSubmission,
  });

  const submitReviewMutation = useMutation({
    mutationFn: async ({ submissionId, reviewData }: { submissionId: string, reviewData: any }) => {
      console.log('Submitting review:', submissionId, reviewData);
      const response = await updateSubmission(submissionId, reviewData)
      if (response.status === 201) {
        toast.success("Review submitted successfully!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setReviewData({ score: '', comments: '' });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit review");
    },
  });

  const addQuestion = () => {
    setNewInterview({
      ...newInterview,
      questions: [...newInterview.questions, '']
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = newInterview.questions.filter((_, i) => i !== index);
    setNewInterview({
      ...newInterview,
      questions: updatedQuestions
    });
  };

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...newInterview.questions];
    updatedQuestions[index] = value;
    setNewInterview({
      ...newInterview,
      questions: updatedQuestions
    });
  };

  const handleSubmitReview = (submissionId: string) => {
    if (!reviewData.score || !reviewData.comments.trim()) {
      toast.error("Please provide both score and comments");
      return;
    }

    const numericScore = parseInt(reviewData.score.toString());
    if (numericScore < 1 || numericScore > 10) {
      toast.error("Score must be between 1 and 10");
      return;
    }

    submitReviewMutation.mutate({
      submissionId,
      reviewData: {
        score: numericScore,
        comments: reviewData.comments,
        reviewedBy: user?._id,
        review: "REVIEWED"
      }
    });
  };

  if (loadingSubmissions && currentView === 'submissions') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (errorSubmissions && currentView === 'submissions') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load submissions</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["submissions"] })}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <DashboardContent
        setCurrentView={setCurrentView}
        setSelectedInterview={setSelectedInterview}
        setIsEditMode={setIsEditMode}
        submissions={submissions}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateInterview
        setCurrentView={setCurrentView}
        newInterview={newInterview}
        setNewInterview={setNewInterview}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        removeQuestion={removeQuestion}
        selectedInterview={selectedInterview}
        isEditMode={isEditMode}
      />
    );
  }

  if (currentView === 'submissions') {
    return (
      <Submissions
        setCurrentView={setCurrentView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        reviewData={reviewData}
        setReviewData={setReviewData}
        handleSubmitReview={handleSubmitReview}
        submissions={submissions}
        isLoading={loadingSubmissions || submitReviewMutation.isPending}
      />
    );
  }

  return null;
};

export default ReviewerDashboard;