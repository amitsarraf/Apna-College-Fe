import { useState, useRef, useCallback } from 'react';
import { VideoAnswer } from '../types/interview';

export const useVideoRecording = (questions: string[]) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const [cameraStatus, setCameraStatus] = useState<any>('idle');
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
    const [videoAnswers, setVideoAnswers] = useState<VideoAnswer[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const previewUrlRef = useRef<string | null>(null);

    const initializeVideoAnswers = useCallback(() => {
        setVideoAnswers(prev => {
            if (prev.length === 0 || prev.length !== questions.length) {
                return questions.map(question => ({
                    question,
                    videoBlob: null,
                    videoUrl: undefined
                }));
            }
            return prev;
        });
    }, [questions.length]);

    const requestCamera = useCallback(async (): Promise<void> => {
        if (cameraStatus === 'ready' && stream) {
            return;
        }

        setCameraStatus('requesting');
        setError('');

        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: true
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraStatus('ready');
                };
            }

        } catch (err: any) {
            console.error('Camera error:', err);
            setCameraStatus('error');

            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera access and try again.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please connect a camera.');
            } else {
                setError('Failed to access camera. Please try again.');
            }
        }
    }, [stream, cameraStatus]);

    const startRecording = useCallback((): void => {
        if (!stream) return;

        chunksRef.current = [];

        try {
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent): void => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = (): void => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });

                setVideoAnswers(prev => prev.map((answer, index) =>
                    index === currentQuestion
                        ? { ...answer, videoBlob: blob }
                        : answer
                ));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimeLeft(60);

            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError('Recording failed. Please try again.');
        }
    }, [stream, currentQuestion]);

    const stopRecording = useCallback((): void => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const resetRecording = useCallback((): void => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setVideoAnswers(prev => prev.map((answer, index) =>
            index === currentQuestion
                ? { ...answer, videoBlob: null, videoUrl: undefined }
                : answer
        ));

        setTimeLeft(60);
        chunksRef.current = [];
        setIsPreviewMode(false);
        setIsPreviewPlaying(false);

        if (previewVideoRef.current) {
            previewVideoRef.current.src = '';
        }
    }, [currentQuestion]);

    const startPreview = useCallback((): void => {
        setVideoAnswers(prev => {
            const currentAnswer = prev[currentQuestion];
            if (currentAnswer?.videoBlob && previewVideoRef.current) {
                if (previewUrlRef.current) {
                    URL.revokeObjectURL(previewUrlRef.current);
                }

                const url = URL.createObjectURL(currentAnswer.videoBlob);
                previewUrlRef.current = url;
                previewVideoRef.current.src = url;
                setIsPreviewMode(true);
            }
            return prev;
        });
    }, [currentQuestion]);

    const togglePreviewPlayback = useCallback((): void => {
        if (previewVideoRef.current) {
            if (isPreviewPlaying) {
                previewVideoRef.current.pause();
                setIsPreviewPlaying(false);
            } else {
                previewVideoRef.current.play();
                setIsPreviewPlaying(true);
            }
        }
    }, [isPreviewPlaying]);

    const exitPreview = useCallback((): void => {
        setIsPreviewMode(false);
        setIsPreviewPlaying(false);
        if (previewVideoRef.current) {
            previewVideoRef.current.pause();
            previewVideoRef.current.currentTime = 0;
        }
    }, []);

    const nextQuestion = useCallback((): void => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(60);
            setIsPreviewMode(false);
            setIsPreviewPlaying(false);

            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
            if (previewVideoRef.current) {
                previewVideoRef.current.src = '';
            }
        }
    }, [currentQuestion, questions.length]);

    const cleanup = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
    }, [stream]);

    return {
        // State
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
    };
};