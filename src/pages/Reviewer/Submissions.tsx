import React, { useMemo, useCallback } from 'react';
import { 
  Users, 
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from './Header';
import SearchBar from './SearchBar';
import SubmissionCard, { ReviewData, Submission } from './SubmissionCard';

interface SubmissionsProps {
  setCurrentView: (view: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  reviewData: ReviewData;
  setReviewData: React.Dispatch<React.SetStateAction<ReviewData>>;
  handleSubmitReview?: (submissionId: string) => void;
  submissions?: { data: any[] };
  isLoading?: boolean;
}

const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div className="text-center py-12">
    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
    <p className="text-gray-600">
      {searchTerm 
        ? 'Try adjusting your search criteria.' 
        : 'Submissions will appear here once candidates complete interviews.'}
    </p>
  </div>
);

const Submissions: React.FC<SubmissionsProps> = ({
  setCurrentView, 
  searchTerm, 
  setSearchTerm, 
  reviewData, 
  setReviewData, 
  handleSubmitReview,
  submissions,
  isLoading = false
}) => {
  // Memoized filtered submissions
  const filteredSubmissions = useMemo(() => {
    if (!submissions?.data) return [];
    
    return submissions.data.filter((submission) => {
      if (searchTerm === '') return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        submission.title.toLowerCase().includes(searchLower) ||
        submission.description.toLowerCase().includes(searchLower)
      );
    });
  }, [submissions?.data, searchTerm]);

  const handleBackClick = useCallback(() => {
    setCurrentView('dashboard');
  }, [setCurrentView]);

  const handleReviewDataChange = useCallback(
  (field: 'score' | 'comments', value: string) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  },
  [setReviewData]
);


  const handleEditReview = useCallback((submission: Submission) => {
    setReviewData({ 
      score: submission.score, 
      comments: submission.comments 
    });
  }, [setReviewData]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onBackClick={handleBackClick}
        submissionCount={filteredSubmissions.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {filteredSubmissions.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <SubmissionCard
                key={submission._id}
                submission={submission}
                reviewData={reviewData}
                onReviewDataChange={handleReviewDataChange}
                onSubmitReview={handleSubmitReview}
                onEditReview={handleEditReview}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Submissions;