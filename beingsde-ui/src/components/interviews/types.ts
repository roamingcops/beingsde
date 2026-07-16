export interface Profile {
  id: string;
  name: string;
  topics: string[];
  experienceLevel: string;
  bio: string;
  calendlyLink: string;
  isAvailable: boolean;
  createdAt: string;
  averageRating: number | null;
  interviewsConducted: number;
  availabilitySlots?: string[];
  availabilityText?: string;
}

export interface Interview {
  id: string;
  interviewerId: string;
  interviewerName: string;
  interviewerEmail: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  topic: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  meetingLink: string;
  feedbackScore: number | null;
  feedbackNotes: string | null;
  candidateReviewDidHappen: boolean | null;
  candidateReviewDsa: number | null;
  candidateReviewSystemDesign: number | null;
  candidateReviewCommunication: number | null;
  candidateReviewNotes: string | null;
  createdAt: string;
}
