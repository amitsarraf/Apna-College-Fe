import React from 'react';
import { Camera, Square, RotateCcw, Eye } from 'lucide-react';
import { VideoAnswer, CameraStatus } from '../../types/interview';

interface VideoControlsProps {
    cameraStatus: CameraStatus;
    isRecording: boolean;
    currentAnswer: VideoAnswer | undefined;
    isPreviewMode: boolean;
    isUploading: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onResetRecording: () => void;
    onStartPreview: () => void;
    onRequestCamera: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
    cameraStatus,
    isRecording,
    currentAnswer,
    isPreviewMode,
    isUploading,
    onStartRecording,
    onStopRecording,
    onResetRecording,
    onStartPreview,
    onRequestCamera
}) => {
    return (
        <div className="flex justify-center gap-4 mb-6">
            {cameraStatus === 'ready' && !isRecording && !currentAnswer?.videoBlob && !isPreviewMode && (
                <button
                    onClick={onStartRecording}
                    disabled={isUploading}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    Start Recording
                </button>
            )}

            {cameraStatus === 'error' && (
                <button
                    onClick={onRequestCamera}
                    disabled={isUploading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <Camera className="w-4 h-4" />
                    Try Camera Again
                </button>
            )}

            {isRecording && (
                <button
                    onClick={onStopRecording}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <Square className="w-4 h-4" />
                    Stop Recording
                </button>
            )}

            {currentAnswer?.videoBlob && !isPreviewMode && (
                <div className="flex gap-3">
                    <button
                        onClick={onResetRecording}
                        disabled={isUploading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Re-record
                    </button>
                    <button
                        onClick={onStartPreview}
                        disabled={isUploading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoControls;