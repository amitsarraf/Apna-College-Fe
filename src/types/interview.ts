export interface Interview {
  _id?: string;
  title?: string;
  questions?: string[];
  description?:string;
  createdAt?:string | number | Date
}

export interface VideoAnswer {
  question: string;
  videoBlob: Blob | null;
  videoUrl?: string;
}

export interface VideoInterviewUIProps {
  interview?: Interview;
  onClose?: () => void;
  candidateId?: string;
  reviewedBy?: string;
}

export interface SubmissionPayload {
  title: string;
  description: string;
  questions: string[];
  candidateId?: string;
  reviewedBy?: string;
  videoAnswers: Array<{
    question: string;
    videoUrl: string;
  }>;
  score: number;
  comments: string;
  interviewId?: string;
}

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'error';

