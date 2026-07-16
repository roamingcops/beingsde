import { useState, useEffect, useCallback } from "react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";
import { Profile, Interview } from "@/components/interviews/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1/interviews";

export function useInterviews() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [directory, setDirectory] = useState<Profile[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authStatus, setAuthStatus] = useState<"loading" | "unauthenticated" | "free" | "premium">("loading");

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAuthStatus("unauthenticated");
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [profileRes, dirRes, interviewsRes] = await Promise.all([
        sessionAwareFetch(`${API_BASE}/profile/me`, { headers }),
        sessionAwareFetch(`${API_BASE}/directory`, { headers }),
        sessionAwareFetch(`${API_BASE}`, { headers }),
      ]);

      if (dirRes.status === 403 || profileRes.status === 403 || interviewsRes.status === 403) {
        setAuthStatus("free");
        setLoading(false);
        return;
      }

      setAuthStatus("premium");

      if (profileRes.ok) {
        const p: Profile = await profileRes.json();
        setProfile({ ...p, isAvailable: p.isAvailable ?? (p as any).available });
      } else {
        setProfile(null);
      }

      if (dirRes.ok) setDirectory(await dirRes.json());
      if (interviewsRes.ok) setInterviews(await interviewsRes.json());
    } catch (e) {
      console.error("Failed to load interview data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProfile = async (body: any) => {
    setError("");
    setSuccessMsg("");
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || data.message || "Failed to save profile");
      }
      
      const updated: Profile = await res.json();
      setProfile({ ...updated, isAvailable: updated.isAvailable ?? (updated as any).available });
      setSuccessMsg("Interviewer profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData(); // refresh directory
    } catch (err: any) {
      setError(err.message || "Network error saving profile");
      throw err;
    }
  };

  const stopOffering = async () => {
    const token = localStorage.getItem("accessToken");
    await sessionAwareFetch(`${API_BASE}/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuccessMsg("You have stopped offering mock interviews.");
    setTimeout(() => setSuccessMsg(""), 3000);
    await loadData();
  };

  const bookInterview = async (profileId: string, topic: string, scheduledAt: string, meetingLink: string) => {
    setError("");
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId, topic, scheduledAt, meetingLink }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to book interview");
      }
      setSuccessMsg("Mock interview booked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Network error scheduling interview");
      throw err;
    }
  };

  const cancelInterview = async (interviewId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/${interviewId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to cancel interview");
      }
      setSuccessMsg("Session cancelled successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Network error cancelling session");
      throw err;
    }
  };

  const submitFeedback = async (interviewId: string, score: number, notes: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/${interviewId}/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit feedback");
      }
      await loadData();
    } catch (err: any) {
      setError(err.message || "Network error submitting feedback");
      throw err;
    }
  };

  return {
    loading,
    authStatus,
    profile,
    directory,
    interviews,
    error,
    successMsg,
    setError,
    saveProfile,
    stopOffering,
    bookInterview,
    cancelInterview,
    submitFeedback,
  };
}
