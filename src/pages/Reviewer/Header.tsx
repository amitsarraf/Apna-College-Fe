import { Video } from "lucide-react";
import React from "react";

const Header: React.FC<{
    onBackClick: () => void;
    submissionCount: number;
}> = ({ onBackClick, submissionCount }) => (
    <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBackClick}
                        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="bg-purple-600 p-2 rounded-lg">
                        <Video className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Interview Submissions</h1>
                </div>
                <div className="text-sm text-gray-600">
                    {submissionCount} submission{submissionCount !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    </header>
);

export default Header