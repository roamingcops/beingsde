import { useState } from "react";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, Star, Video } from "lucide-react";
import { Interview } from "./types";

interface MyInterviewsProps {
  interviews: Interview[];
  onCancel: (id: string) => Promise<void>;
  onSubmitFeedback: (id: string, score: number, notes: string) => Promise<void>;
  onSubmitCandidateReview: (
    id: string,
    didHappen: boolean,
    dsa: number | null,
    systemDesign: number | null,
    communication: number | null,
    notes: string
  ) => Promise<void>;
}

export function MyInterviews({ interviews, onCancel, onSubmitFeedback, onSubmitCandidateReview }: MyInterviewsProps) {
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null);
  
  const [feedbackScores, setFeedbackScores] = useState<Record<string, number>>({});
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this interview session?")) return;
    setCancellingId(id);
    try {
      await onCancel(id);
    } finally {
      setCancellingId(null);
    }
  };

  const handleSubmitFeedback = async (id: string) => {
    setSubmittingFeedback(id);
    try {
      await onSubmitFeedback(id, feedbackScores[id] || 0, feedbackNotes[id] || "");
    } finally {
      setSubmittingFeedback(null);
    }
  };

  return (
    <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          My Interviews
        </h2>
        <span className="text-3xs font-mono text-zinc-400">Track and review your mock sessions</span>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <Calendar className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm text-zinc-400">No interviews yet. Book one from the directory above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Upcoming Sessions
            </h3>
            {interviews.filter((i) => i.status === "SCHEDULED").length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-md border border-dashed border-zinc-200 dark:border-zinc-800">
                No upcoming interviews.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {interviews
                  .filter((i) => i.status === "SCHEDULED")
                  .map((interview) => (
                    <InterviewRow
                      key={interview.id}
                      interview={interview}
                      userEmail={userEmail}
                      submittingFeedback={submittingFeedback}
                      feedbackScores={feedbackScores}
                      feedbackNotes={feedbackNotes}
                      setFeedbackScores={setFeedbackScores}
                      setFeedbackNotes={setFeedbackNotes}
                      onSubmitFeedback={handleSubmitFeedback}
                      onCancel={handleCancel}
                      cancellingId={cancellingId}
                      onSubmitCandidateReview={onSubmitCandidateReview}
                    />
                  ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> History & Feedback
            </h3>
            {interviews.filter((i) => i.status !== "SCHEDULED").length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-md border border-dashed border-zinc-200 dark:border-zinc-800">
                No past interviews.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {interviews
                  .filter((i) => i.status !== "SCHEDULED")
                  .map((interview) => (
                    <InterviewRow
                      key={interview.id}
                      interview={interview}
                      userEmail={userEmail}
                      submittingFeedback={submittingFeedback}
                      feedbackScores={feedbackScores}
                      feedbackNotes={feedbackNotes}
                      setFeedbackScores={setFeedbackScores}
                      setFeedbackNotes={setFeedbackNotes}
                      onSubmitFeedback={handleSubmitFeedback}
                      onCancel={handleCancel}
                      cancellingId={cancellingId}
                      onSubmitCandidateReview={onSubmitCandidateReview}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function InterviewRow({
  interview,
  userEmail,
  submittingFeedback,
  feedbackScores,
  feedbackNotes,
  setFeedbackScores,
  setFeedbackNotes,
  onSubmitFeedback,
  onCancel,
  cancellingId,
  onSubmitCandidateReview,
}: {
  interview: Interview;
  userEmail: string | null;
  submittingFeedback: string | null;
  feedbackScores: Record<string, number>;
  feedbackNotes: Record<string, string>;
  setFeedbackScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setFeedbackNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmitFeedback: (id: string) => void;
  onCancel: (id: string) => void;
  cancellingId: string | null;
  onSubmitCandidateReview: (
    id: string,
    didHappen: boolean,
    dsa: number | null,
    systemDesign: number | null,
    communication: number | null,
    notes: string
  ) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const [reviewDidHappen, setReviewDidHappen] = useState(true);
  const [reviewDsa, setReviewDsa] = useState<number>(0);
  const [reviewSys, setReviewSys] = useState<number>(0);
  const [reviewComm, setReviewComm] = useState<number>(0);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleCandidateReviewSubmit = async () => {
    setSubmittingReview(true);
    try {
      await onSubmitCandidateReview(
        interview.id,
        reviewDidHappen,
        reviewDidHappen ? reviewDsa : null,
        reviewDidHappen ? reviewSys : null,
        reviewDidHappen ? reviewComm : null,
        reviewNotes
      );
      setExpanded(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isInterviewer = userEmail && interview.interviewerEmail ? interview.interviewerEmail === userEmail : (userEmail ? interview.interviewerId !== interview.candidateId : false);
  const roleLabel = isInterviewer ? "As Interviewer" : "As Candidate";
  const partnerName = isInterviewer ? interview.candidateName : interview.interviewerName;
  const partnerEmail = isInterviewer ? interview.candidateEmail : interview.interviewerEmail;

  return (
    <div className={`border p-4 rounded-lg flex flex-col gap-3 transition-colors duration-200 ${
      interview.status === "SCHEDULED" 
        ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" 
        : "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/10"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <span className={`text-3xs font-bold font-mono uppercase px-2 py-0.5 border rounded-full shrink-0 ${
            isInterviewer 
              ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
              : "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
          }`}>
            {roleLabel}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">{interview.topic}</span>
            <span className="text-3xs text-zinc-400 truncate">
              {isInterviewer ? "Candidate: " : "Interviewer: "} <strong>{partnerName}</strong> ({partnerEmail})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {interview.scheduledAt && (
            <span className="text-3xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-sm flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(interview.scheduledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          <span className={`text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
            interview.status === "SCHEDULED"
              ? "border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
              : interview.status === "COMPLETED"
              ? "border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 bg-zinc-100 dark:bg-zinc-800/40"
          }`}>
            {interview.status}
          </span>

          {interview.status === "SCHEDULED" && interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xs font-bold uppercase tracking-wider bg-transparent text-zinc-800 dark:text-zinc-200 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-zinc-300 rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              <Video className="w-3 h-3" /> Join
            </a>
          )}

          {interview.status === "SCHEDULED" && (
            <button
              onClick={() => onCancel(interview.id)}
              disabled={cancellingId === interview.id}
              className="text-3xs font-bold uppercase tracking-wider text-red-500 border border-transparent hover:border-red-300 dark:hover:border-red-900/60 px-3 py-1.5 rounded-md hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {interview.status === "SCHEDULED" && isInterviewer && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-3xs font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-3 py-1.5 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 rounded-md transition-all flex items-center gap-1 shadow-sm"
            >
              Feedback {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {!isInterviewer && interview.status !== "CANCELLED" && interview.candidateReviewDidHappen == null && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-3xs font-bold uppercase tracking-wider bg-indigo-600 text-white px-3 py-1.5 border border-indigo-600 hover:bg-transparent hover:text-indigo-600 rounded-md transition-all flex items-center gap-1 shadow-sm"
            >
              Review Interviewer {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {interview.feedbackScore != null && (
            <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 px-2 py-0.5 rounded-md">
              <span>{interview.feedbackScore}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          )}
        </div>
      </div>

      {interview.status === "COMPLETED" && interview.feedbackNotes && (
        <div className="mt-2.5 p-3 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-md">
          <span className="text-3xs font-mono font-bold uppercase text-zinc-400 block mb-1">Feedback from Interviewer</span>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
            &ldquo;{interview.feedbackNotes}&rdquo;
          </p>
        </div>
      )}

      {interview.candidateReviewDidHappen != null && (
        <div className="mt-2.5 p-3 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-200/40 dark:border-indigo-900/40 rounded-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono font-bold uppercase text-indigo-400 block">Candidate Review</span>
            {!interview.candidateReviewDidHappen && (
              <span className="text-3xs font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-sm">No Show</span>
            )}
          </div>
          {interview.candidateReviewDidHappen && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <span className="text-3xs text-zinc-500 uppercase">DSA:</span>
                <span className="text-xs font-bold flex items-center gap-0.5">{interview.candidateReviewDsa} <Star className="w-3 h-3 fill-amber-400 text-amber-400" /></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-3xs text-zinc-500 uppercase">Sys Design:</span>
                <span className="text-xs font-bold flex items-center gap-0.5">{interview.candidateReviewSystemDesign} <Star className="w-3 h-3 fill-amber-400 text-amber-400" /></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-3xs text-zinc-500 uppercase">Comm:</span>
                <span className="text-xs font-bold flex items-center gap-0.5">{interview.candidateReviewCommunication} <Star className="w-3 h-3 fill-amber-400 text-amber-400" /></span>
              </div>
            </div>
          )}
          {interview.candidateReviewNotes && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
              &ldquo;{interview.candidateReviewNotes}&rdquo;
            </p>
          )}
        </div>
      )}

      {expanded && isInterviewer && (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Score performance</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() =>
                    setFeedbackScores((prev) => ({ ...prev, [interview.id]: score }))
                  }
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      (feedbackScores[interview.id] || 0) >= score
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Detailed Feedback Notes</span>
            <textarea
              value={feedbackNotes[interview.id] || ""}
              onChange={(e) =>
                setFeedbackNotes((prev) => ({ ...prev, [interview.id]: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors resize-none rounded-md"
              placeholder="Provide constructive feedback detailing their trade-off analysis, system components depth, and technical communication..."
            />
          </div>

          <button
            onClick={() => onSubmitFeedback(interview.id)}
            disabled={submittingFeedback === interview.id}
            className="self-start text-3xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all rounded-md shadow-sm disabled:opacity-50"
          >
            {submittingFeedback === interview.id ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}

      {expanded && !isInterviewer && interview.candidateReviewDidHappen == null && (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Did the interview happen?</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`didHappen-${interview.id}`}
                  checked={reviewDidHappen === true}
                  onChange={() => setReviewDidHappen(true)}
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                <span className="text-xs text-zinc-700 dark:text-zinc-300">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`didHappen-${interview.id}`}
                  checked={reviewDidHappen === false}
                  onChange={() => setReviewDidHappen(false)}
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                <span className="text-xs text-zinc-700 dark:text-zinc-300">No (No-show)</span>
              </label>
            </div>
          </div>

          {reviewDidHappen && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono font-bold uppercase text-zinc-400">DSA Skills</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button key={score} onClick={() => setReviewDsa(score)} className="p-0.5 hover:scale-110 transition-transform">
                      <Star className={`w-4 h-4 ${reviewDsa >= score ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono font-bold uppercase text-zinc-400">System Design</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button key={score} onClick={() => setReviewSys(score)} className="p-0.5 hover:scale-110 transition-transform">
                      <Star className={`w-4 h-4 ${reviewSys >= score ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Communication</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button key={score} onClick={() => setReviewComm(score)} className="p-0.5 hover:scale-110 transition-transform">
                      <Star className={`w-4 h-4 ${reviewComm >= score ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Review Notes (Optional)</span>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors resize-none rounded-md"
              placeholder="Leave a review for this interviewer..."
            />
          </div>

          <button
            onClick={handleCandidateReviewSubmit}
            disabled={submittingReview}
            className="self-start text-3xs font-semibold uppercase tracking-wider bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-all rounded-md shadow-sm disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
