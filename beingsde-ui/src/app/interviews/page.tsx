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

      {authStatus === "unauthenticated" && (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm text-center px-4">
          <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-5 border border-zinc-200 dark:border-zinc-700">
            <Lock className="w-6 h-6 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Authentication Required</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md text-sm">
            You need to sign in or create an account to view the interviewer directory, book mock sessions, or offer your own time to other candidates.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-md shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign In to Continue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {authStatus === "free" && (
        <div className="flex flex-col items-center justify-center py-20 bg-amber-50/30 dark:bg-amber-950/10 border border-dashed border-amber-200 dark:border-amber-900/50 rounded-lg shadow-sm text-center px-4">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-5 border border-amber-200 dark:border-amber-800">
            <Crown className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Premium Feature</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md text-sm">
            Mock Interviews are an exclusive feature for Premium members. Upgrade your account to unlock the ability to schedule live 1-on-1 system design sessions with experienced architects.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-amber-600 transition-colors"
          >
            Upgrade to Premium <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {authStatus === "premium" && (
        <>
          {/* Notifications */}
      {error && (
        <div className="flex gap-2.5 items-start p-4 text-sm border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex gap-2.5 items-start p-4 text-sm border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-md">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
      </>
      )}

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
