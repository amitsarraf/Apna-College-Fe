export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getCompletedCount = (videoAnswers: Array<{ videoBlob: Blob | null }>): number => {
    return videoAnswers.filter(answer => answer.videoBlob).length;
};

export const getAllCompleted = (videoAnswers: Array<{ videoBlob: Blob | null }>): boolean => {
    return videoAnswers.every(answer => answer.videoBlob !== null);
};

export const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

export const getReviewStatusStyle = (status: string): string => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  };
  return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};