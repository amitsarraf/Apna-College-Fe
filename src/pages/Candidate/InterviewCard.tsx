import { Video, Clock, CheckCircle, AlertCircle, Calendar, Star } from 'lucide-react';

interface Interview {
  _id: string;
  title: string;
  company: string;
  description: string;
  questions: number;
  duration: string;
  status: 'available' | 'in-progress' | 'completed';
  deadline?: string;
  score?: number;
  attemptedBy?: string[];
}

interface InterviewCardProps {
  interview: Interview;
  type?: 'admin' | 'candidate' | 'reviewer';
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const getStatusIcon = () => {
    switch (interview.status) {
      case 'available':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (interview.status) {
      case 'available':
        return 'Available';
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  const getButtonText = () => {
    switch (interview.status) {
      case 'available':
        return 'Start Interview';
      case 'in-progress':
        return 'Continue Interview';
      case 'completed':
        return 'View Details';
      default:
        return 'View';
    }
  };

  const getButtonColor = () => {
    switch (interview.status) {
      case 'available':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'in-progress':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'completed':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{interview.title}</h3>
          <p className="text-gray-600 font-medium">{interview.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{interview.description}</p>

      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Video className="w-4 h-4" />
          <span>{interview.questions} questions</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{interview.duration}</span>
        </div>
        {interview.deadline && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Due: {interview.deadline}</span>
          </div>
        )}
      </div>

      {interview.score && (
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Score: {interview.score}/10</span>
        </div>
      )}

      <button className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${getButtonColor()}`}>
        {getButtonText()}
      </button>
    </div>
  );
};

export default InterviewCard;
