import React from 'react';
import { Camera, Play, Pause } from 'lucide-react';
import { CameraStatus } from '../../types/interview';
import { formatTime } from '../../utils/helpers';

interface VideoDisplayProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    previewVideoRef: React.RefObject<HTMLVideoElement | null>;
    cameraStatus: CameraStatus;
    isRecording: boolean;
    timeLeft: number;
    isPreviewMode: boolean;
    isPreviewPlaying: boolean;
    onTogglePreviewPlayback: () => void;
    onExitPreview: () => void;
}


const VideoDisplay: React.FC<VideoDisplayProps> = ({
    videoRef,
    previewVideoRef,
    cameraStatus,
    isRecording,
    timeLeft,
    isPreviewMode,
    isPreviewPlaying,
    onTogglePreviewPlayback,
    onExitPreview
}) => {
    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
            {cameraStatus === 'requesting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Requesting camera access...</p>
                    </div>
                </div>
            )}

            {cameraStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Camera not available</p>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                    transform: 'scaleX(-1)',
                    display: cameraStatus === 'ready' && !isPreviewMode ? 'block' : 'none'
                }}
            />

            <video
                ref={previewVideoRef}
                controls={false}
                playsInline
                className="w-full h-full object-cover"
                style={{
                    display: isPreviewMode ? 'block' : 'none'
                }}
            />

            {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording</span>
                </div>
            )}

            {isRecording && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full z-10">
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
            )}

            {isPreviewMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={onTogglePreviewPlayback}
                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-4 rounded-full transition-all duration-200"
                    >
                        {isPreviewPlaying ? (
                            <Pause className="w-8 h-8" />
                        ) : (
                            <Play className="w-8 h-8" />
                        )}
                    </button>
                </div>
            )}

            {isPreviewMode && (
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={onExitPreview}
                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded-full text-sm transition-all duration-200"
                    >
                        ← Back to Camera
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoDisplay;