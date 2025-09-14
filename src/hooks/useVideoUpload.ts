import { useMutation } from '@tanstack/react-query';
import { VideoAnswer, SubmissionPayload } from '../types/interview';
import { createSubmission } from '../api/submission';

const uploadBlobToCloudinary = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "my-upload-url");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_API_CLOUDINAY_KEY}/video/upload`,
        {
            method: 'POST',
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
};



export const useVideoUpload = () => {
    return useMutation({
        mutationFn: async (params: {
            videoAnswers: VideoAnswer[];
            payload: Omit<SubmissionPayload, 'videoAnswers'>;
        }) => {
            const { videoAnswers, payload } = params;
            const videosToUpload = videoAnswers.filter(answer => answer.videoBlob);

            if (videosToUpload.length === 0) {
                throw new Error('No videos recorded to submit.');
            }

            const uploadPromises = videosToUpload.map(async (answer) => {
                const videoUrl = await uploadBlobToCloudinary(answer.videoBlob!);
                return {
                    question: answer.question,
                    videoUrl: videoUrl
                };
            });

            const uploadedVideoAnswers = await Promise.all(uploadPromises);

            const finalPayload: SubmissionPayload = {
                ...payload,
                videoAnswers: uploadedVideoAnswers
            };

            const response = await createSubmission(finalPayload);
            return response
        }
    });
};