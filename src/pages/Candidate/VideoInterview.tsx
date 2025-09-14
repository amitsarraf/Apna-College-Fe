// Fixed VideoInterviewUI.tsx
import React, { useEffect } from 'react';
import { Camera, ArrowLeft, Upload } from 'lucide-react';
import { VideoInterviewUIProps } from '../../types/interview';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { useVideoUpload } from '../../hooks/useVideoUpload';
import { formatTime, getCompletedCount, getAllCompleted } from '../../utils/helpers';
import VideoDisplay from './VideoDisplay';
import VideoControls from './VideoControls';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const VideoInterviewUI: React.FC<VideoInterviewUIProps> = ({
  interview,
  onClose,
  reviewedBy
}) => {
  const questions = interview?.questions || [
    "Tell us about yourself and your background.",
    "Why are you interested in this position?",
    "What are your greatest strengths?",
    "Describe a challenge you've overcome in your career.",
    "Where do you see yourself in 5 years?"
  ];

  const {
    isRecording,
    timeLeft,
    currentQuestion,
    stream,
    error,
    cameraStatus,
    isPreviewMode,
    isPreviewPlaying,
    videoAnswers,
    videoRef,
    previewVideoRef,
    initializeVideoAnswers,
    requestCamera,
    startRecording,
    stopRecording,
    resetRecording,
    startPreview,
    togglePreviewPlayback,
    exitPreview,
    nextQuestion,
    cleanup,
    setError
  } = useVideoRecording(questions);

  const { user } = useUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  const uploadMutation = useVideoUpload();

  useEffect(() => {
    initializeVideoAnswers();
  }, []);

  useEffect(() => {
    requestCamera();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/dashboard")
    }
  }, [user])

  useEffect(() => {
    const previewVideo = previewVideoRef.current;
    if (previewVideo && isPreviewMode) {
      const handlePlay = () => { };
      const handlePause = () => { };
      const handleEnded = () => { };

      previewVideo.addEventListener('play', handlePlay);
      previewVideo.addEventListener('pause', handlePause);
      previewVideo.addEventListener('ended', handleEnded);

      return () => {
        previewVideo.removeEventListener('play', handlePlay);
        previewVideo.removeEventListener('pause', handlePause);
        previewVideo.removeEventListener('ended', handleEnded);
      };
    }
  }, [isPreviewMode]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const getCurrentVideoAnswer = () => {
    return videoAnswers[currentQuestion];
  };



  const handleSubmitAll = async () => {
    const payload = {
      title: interview?.title || "Video Interview Submission",
      description: "Candidate answers for the interview",
      questions: questions,
      candidateId: user?._id,
      ...(reviewedBy && { reviewedBy }),
      score: 0,
      comments: "",
      interviewId: interview?._id
    };

    try {
      const response = await uploadMutation.mutateAsync({
        videoAnswers,
        payload
      });

      if (response?.status === 201) {
        toast.success("Answers Submitted Succssfully")
        queryClient.invalidateQueries({ queryKey: ['interviews'] });
      } else {
        toast.error("Error while submision")
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };

  const currentAnswer = getCurrentVideoAnswer();
  const completedCount = getCompletedCount(videoAnswers);
  const allCompleted = getAllCompleted(videoAnswers);

  if (cameraStatus === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {interview?.title || 'Video Interview'}
          </h1>
          <p className="text-gray-600 mb-6">
            Ready to start your interview? We'll record your responses to {questions.length} questions.
            Each response will be limited to 1 minute.
          </p>
          <button
            onClick={requestCamera}
            disabled={cameraStatus === 'requesting'}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            {cameraStatus === 'requesting' ? (
              <>
                <LoadingSpinner size="sm" />
                Requesting Camera...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Start Interview
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-blue-500 rounded transition-colors"
                    disabled={uploadMutation.isPending}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-2xl font-bold">
                  {interview?.title || 'Video Interview'}
                </h1>
                {isPreviewMode && (
                  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">Preview Mode</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">
                  Question {currentQuestion + 1} of {questions.length}
                  <span className="ml-2">({completedCount} recorded)</span>
                </div>
                <div className="text-2xl font-mono">{formatTime(timeLeft)}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 h-1">
            <div
              className="bg-blue-600 h-1 transition-all duration-300"
              style={{ width: `${(completedCount / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-6 bg-gray-50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Question {currentQuestion + 1}:
                </h2>
                <p className="text-lg text-gray-700">{questions[currentQuestion]}</p>
              </div>
              {currentAnswer?.videoBlob && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Recorded
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <VideoDisplay
              videoRef={videoRef}
              previewVideoRef={previewVideoRef}
              cameraStatus={cameraStatus}
              isRecording={isRecording}
              timeLeft={timeLeft}
              isPreviewMode={isPreviewMode}
              isPreviewPlaying={isPreviewPlaying}
              onTogglePreviewPlayback={togglePreviewPlayback}
              onExitPreview={exitPreview}
            />

            {error && (
              <ErrorDisplay
                error={error}
                onRetry={() => {
                  setError('');
                  requestCamera();
                }}
              />
            )}

            {uploadMutation.isPending && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <LoadingSpinner size="sm" />
                  <p className="text-blue-700 text-sm">
                    Uploading {getCompletedCount(videoAnswers)} videos
                  </p>
                </div>
              </div>
            )}

            {uploadMutation.isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 text-sm">
                  Successfully uploaded videos! Interview submitted.
                </p>
              </div>
            )}

            {uploadMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">
                  {uploadMutation.error?.message || 'Upload failed. Please try again.'}
                </p>
                <button
                  onClick={() => uploadMutation.reset()}
                  className="text-red-600 hover:text-red-800 text-xs underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            <VideoControls
              cameraStatus={cameraStatus}
              isRecording={isRecording}
              currentAnswer={currentAnswer}
              isPreviewMode={isPreviewMode}
              isUploading={uploadMutation.isPending}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onResetRecording={resetRecording}
              onStartPreview={startPreview}
              onRequestCamera={requestCamera}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {cameraStatus === 'requesting' && 'Requesting camera access...'}
                {cameraStatus === 'error' && 'Camera access failed. Please try again.'}
                {cameraStatus === 'ready' && !currentAnswer?.videoBlob && !isPreviewMode && 'Click "Start Recording" when ready to answer.'}
                {currentAnswer?.videoBlob && !isPreviewMode && 'Recording completed! Click "Preview" to review your answer.'}
                {isPreviewMode && 'Preview your recording. Click the play button to watch.'}
                {uploadMutation.isPending && 'Please wait while videos are being uploaded in parallel...'}
              </div>

              <div className="flex gap-3">
                {currentQuestion < questions.length - 1 && (
                  <button
                    onClick={nextQuestion}
                    disabled={!currentAnswer?.videoBlob || isPreviewMode || uploadMutation.isPending}
                    className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${currentAnswer?.videoBlob && !isPreviewMode && !uploadMutation.isPending
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Next Question →
                  </button>
                )}

                {(allCompleted || (currentQuestion === questions.length - 1 && currentAnswer?.videoBlob)) && !isPreviewMode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <button
                      onClick={handleSubmitAll}
                      disabled={uploadMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Submit All ({completedCount} videos)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default VideoInterviewUI;