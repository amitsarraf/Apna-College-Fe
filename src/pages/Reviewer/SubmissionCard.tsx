
import React from "react";
import { getReviewStatusStyle, formatDate } from "../../utils/helpers";
import { CheckCircle, Star } from "lucide-react";


const VideoPlayer = React.memo<{ videoUrl: string; question: string }>(({ videoUrl, question }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="mb-2">
      <span className="text-sm font-medium text-gray-700">{question}</span>
    </div>
    <div className="relative">
      <video 
        key={videoUrl}
        controls 
        className="w-full h-32 bg-gray-100 rounded-lg object-cover"
        preload="metadata"
      >
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
));

VideoPlayer.displayName = 'VideoPlayer';

const SubmissionHeader: React.FC<{ submission: Submission }> = ({ submission }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
      <p className="text-gray-600">{submission.description}</p>
      <div className="flex items-center space-x-4 mt-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatusStyle(submission.review)}`}>
          {submission.review}
        </span>
        <span className="text-sm text-gray-500">
          Submitted: {formatDate(submission.createdAt)}
        </span>
      </div>
    </div>
  </div>
);

const VideoAnswersSection: React.FC<{ submission: Submission }> = ({ submission }) => (
  <div className="mb-6">
    <h4 className="text-sm font-medium text-gray-700 mb-3">
      Video Answers ({submission.videoAnswers.length}):
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {submission.videoAnswers.map((answer, index) => (
        <VideoPlayer
          key={`${submission._id}-${answer._id}`}
          videoUrl={answer.videoUrl}
          question={`${index + 1}. ${answer.question}`}
        />
      ))}
    </div>
  </div>
);

const CompletedReview: React.FC<{
  submission: Submission;
  onEditReview: () => void;
}> = ({ submission, onEditReview }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">Score: {submission.score}/10</span>
        </div>
        <p className="text-gray-700">{submission.comments || 'No comments provided'}</p>
        {submission.reviewedBy && (
          <p className="text-xs text-gray-500 mt-2">
            Reviewed by: {submission.reviewedBy}
          </p>
        )}
      </div>
      <button 
        onClick={onEditReview}
        className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
        disabled={true}
      >
        Edit Review
      </button>
    </div>
  </div>
);

const ReviewForm: React.FC<{
  reviewData: ReviewData;
  onReviewDataChange: (field: 'score' | 'comments', value: string) => void;
  onSubmitReview: () => void;
  isSubmitDisabled: boolean;
  submission: any
}> = ({ reviewData, onReviewDataChange, onSubmitReview, isSubmitDisabled }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Add Your Review:</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Score (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={reviewData.score}
          onChange={(e) => onReviewDataChange('score', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="1-10"
        />
      </div>
    </div>
    
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Comments
      </label>
      <textarea
        value={reviewData.comments}
        onChange={(e) => onReviewDataChange('comments', e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        placeholder="Share your feedback about this candidate..."
      />
    </div>
    
    <button
      onClick={onSubmitReview}
      disabled={isSubmitDisabled}
      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
    >
      <CheckCircle className="w-4 h-4" />
      <span>Submit Review</span>
    </button>
  </div>
);


export interface VideoAnswer {
  question: string;
  videoUrl: string;
  _id: string;
}

export interface Submission {
  _id: string;
  title: string;
  description: string;
  review: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  videoAnswers: VideoAnswer[];
  questions: string[];
  reviewedBy: string | null;
  score: number;
  comments: string;
  candidateId: string;
  interviewId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewData {
  score: string | number;
  comments: string;
}

const SubmissionCard: React.FC<{
  submission: Submission;
  reviewData: ReviewData;
  onReviewDataChange: (field: 'score' | 'comments', value: string) => void;
  onSubmitReview: any;
  onEditReview: (submission: Submission) => void;
}> = ({ submission, reviewData, onReviewDataChange, onSubmitReview, onEditReview }) => {
  const isReviewed = ['REVIEWED', 'APPROVED', 'REJECTED'].includes(submission.review);
  const isSubmitDisabled = !reviewData.score || !reviewData.comments.trim();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <SubmissionHeader submission={submission} />
        <VideoAnswersSection submission={submission} />
        
        {isReviewed ? (
          <CompletedReview 
            submission={submission}
            onEditReview={() => onEditReview(submission)}
          />
        ) : (
          <ReviewForm
            reviewData={reviewData}
            onReviewDataChange={onReviewDataChange}
            onSubmitReview={() => onSubmitReview(submission._id)}
            isSubmitDisabled={isSubmitDisabled}
            submission={submission}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionCard