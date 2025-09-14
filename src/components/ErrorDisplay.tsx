import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <p className="text-red-600 text-sm">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 text-xs underline mt-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;