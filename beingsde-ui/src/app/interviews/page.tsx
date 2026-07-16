"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Lock, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useInterviews } from "@/hooks/useInterviews";
import { Profile } from "@/components/interviews/types";
import { InterviewerConsole } from "@/components/interviews/InterviewerConsole";
import { InterviewerDirectory } from "@/components/interviews/InterviewerDirectory";
import { MyInterviews } from "@/components/interviews/MyInterviews";
import { BookingModal } from "@/components/interviews/BookingModal";

export default function InterviewsPage() {
  const {
    loading,
    authStatus,
    profile,
    directory,
    interviews,
    error,
    successMsg,
    saveProfile,
    stopOffering,
    bookInterview,
    cancelInterview,
    submitFeedback,
  } = useInterviews();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const openBookingModal = (interviewer: Profile) => {
    setSelectedProfile(interviewer);
    setShowBookingModal(true);
  };

  const handleBook = async (topic: string, scheduledAt: string, meetingLink: string) => {
    if (selectedProfile) {
      await bookInterview(selectedProfile.id, topic, scheduledAt, meetingLink);
    }
  };

  if (loading || authStatus === "loading") {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Banner / Header */}
      <section className="relative overflow-hidden rounded-lg bg-zinc-900 text-zinc-100 p-8 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-3xs font-mono font-bold tracking-widest uppercase bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-1 rounded-full w-max">
              Premium Mock Interviews
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
              Mock Interviews
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Conduct high-fidelity system design mock sessions with experienced engineers or offer your skills to help other system architects grow.
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        {/* Workspace Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-500 ${authStatus !== "premium" ? "opacity-40 select-none pointer-events-none blur-[2px]" : ""}`}>
          {/* Left Column: Interviewer Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <InterviewerConsole
              profile={profile}
              onSave={saveProfile}
              onStopOffering={stopOffering}
            />
          </div>

          {/* Right Column: Search & Schedule Directory */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <InterviewerDirectory
              directory={directory}
              onSimulate={openBookingModal}
            />

            <MyInterviews
              interviews={interviews}
              onCancel={cancelInterview}
              onSubmitFeedback={submitFeedback}
            />
          </div>
        </div>

        {/* Overlay Paywalls */}
        {authStatus === "unauthenticated" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl text-center max-w-lg mx-auto transform transition-all">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                <Lock className="w-7 h-7 text-zinc-500 dark:text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Authentication Required</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                You need to sign in or create an account to view the interviewer directory, book mock sessions, or offer your own time to other candidates.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In to Continue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {authStatus === "free" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-amber-200/50 dark:border-amber-900/50 rounded-2xl shadow-2xl shadow-amber-900/5 text-center max-w-lg mx-auto transform transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 rounded-full flex items-center justify-center mb-6 border border-amber-200 dark:border-amber-800 shadow-inner">
                <Crown className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Premium Feature</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Mock Interviews are an exclusive feature for Premium members. Upgrade your account to unlock the ability to schedule live 1-on-1 system design sessions with experienced architects.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                Upgrade to Premium <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {showBookingModal && selectedProfile && authStatus === "premium" && (
        <BookingModal
          profile={selectedProfile}
          onClose={() => setShowBookingModal(false)}
          onBook={handleBook}
        />
      )}
    </div>
  );
}
