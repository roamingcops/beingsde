"use client";

import { useState, useEffect } from "react";
import { Check, Star, Users, ExternalLink, AlertCircle, CheckCircle, Loader2, Calendar, Clock, CreditCard, History } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1/payments";

export default function SubscriptionsPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Subscription info
  const [subscription, setSubscription] = useState<{
    status: string;
    tier: string;
    autoRenew: boolean;
    expiresAt: string;
  } | null>(null);

  // History info
  const [history, setHistory] = useState<{
    subscriptions: Array<{
      id: string;
      tier: string;
      status: string;
      razorpaySubscriptionId: string;
      startedAt: string;
      expiresAt: string;
      autoRenew: boolean;
      createdAt: string;
    }>;
    payments: Array<{
      id: string;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      amountInPaise: number;
      currency: string;
      status: string;
      paymentMethod: string;
      createdAt: string;
    }>;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"payments" | "subscriptions">("payments");

  // Sandbox simulations
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState<{
    subscriptionId: string;
    amount: number;
    currency: string;
  } | null>(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const res = await sessionAwareFetch(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "")}/api/v1/payments/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res && res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch billing history:", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    sessionAwareFetch(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "")}/api/v1/payments/subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res && res.ok) return res.json();
      })
      .then((data) => {
        if (data) setSubscription(data);
      })
      .catch(() => {});

    fetchHistory();
  }, []);

  const handleCheckout = async (planId: string) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please sign in to upgrade your subscription tier.");
      setLoading(false);
      return;
    }

    try {
      const res = await sessionAwareFetch(`${API_BASE}/razorpay/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create subscription checkout.");
        setLoading(false);
        return;
      }

      const orderData = await res.json();

      if (orderData.keyId === "rzp_test_placeholder") {
        // Simulation Mode (Local Dev/Sandbox)
        setSimulatedOrder({
          subscriptionId: orderData.subscriptionId,
          amount: orderData.amount,
          currency: orderData.currency,
        });
        setShowSimulateModal(true);
        setLoading(false);
      } else {
        // Live Razorpay script overlay flow
        const options = {
          key: orderData.keyId,
          subscription_id: orderData.subscriptionId,
          name: "beingsde.com",
          description: "Premium Pass subscription",
          handler: async function (response: any) {
            setLoading(true);
            try {
              const verifyRes = await sessionAwareFetch(`${API_BASE}/razorpay/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  subscriptionId: response.razorpay_subscription_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });
              if (verifyRes.ok) {
                const verifyData = await verifyRes.json();
                localStorage.setItem("accessToken", verifyData.accessToken);
                localStorage.setItem("userRole", verifyData.role);
                setSuccess("Payment successful! Your account has been upgraded to Premium.");
                setTimeout(() => window.location.reload(), 2000);
              } else {
                const errData = await verifyRes.json();
                setError(errData.message || "Payment verification failed.");
              }
            } catch {
              setError("Network error validating payment.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            email: localStorage.getItem("userEmail") || "",
          },
          theme: {
            color: "#09090b",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);
      }

    } catch {
      setError("Network error creating subscription checkout.");
      setLoading(false);
    }
  };

  const confirmSimulatedPayment = async () => {
    if (!simulatedOrder) return;
    setShowSimulateModal(false);
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    const mockPaymentId = "pay_sim_" + Math.random().toString(36).substring(7);
    const mockSignature = "signature_sim_" + Math.random().toString(36).substring(7);

    try {
      const verifyRes = await sessionAwareFetch(`${API_BASE}/razorpay/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriptionId: simulatedOrder.subscriptionId,
          paymentId: mockPaymentId,
          signature: mockSignature,
        }),
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        localStorage.setItem("accessToken", verifyData.accessToken);
        localStorage.setItem("userRole", verifyData.role);
        setSuccess("Payment successful! Sandbox user upgraded to Premium tier.");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const errData = await verifyRes.json();
        setError(errData.message || "Simulated payment verification failed.");
      }
    } catch {
      setError("Network error validating simulated payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "")}/api/v1/payments/subscription/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSuccess("Subscription cancelled successfully. Auto-pay has been disabled.");
        setSubscription((prev) => prev ? { ...prev, autoRenew: false, status: "CANCELLED" } : null);
        fetchHistory();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to cancel subscription.");
      }
    } catch {
      setError("Network error cancelling subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Page Header */}
      <section className="text-center max-w-xl flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-200 bg-clip-text text-transparent">
          Structured Pricing Plans
        </h1>
        <p className="text-sm text-zinc-550">
          Get unlimited access to high-resolution system design breakdowns, low-level diagrams, and 1-on-1 mock interviews.
        </p>
      </section>

      {/* Notifications */}
      {error && (
        <div className="w-full max-w-3xl flex gap-2.5 items-start p-4 text-sm border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="w-full max-w-3xl flex gap-2.5 items-start p-4 text-sm border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-md animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Active Subscription Info */}
      {subscription && subscription.status === "ACTIVE" && (
        <div className="w-full max-w-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              Active Premium Subscription
            </h3>
            <p className="text-xs text-zinc-500">
              Auto-renew (Auto-pay) is <span className="font-semibold text-emerald-600 dark:text-emerald-400">ON</span>. 
              Billing period ends: <span className="font-mono">{new Date(subscription.expiresAt).toLocaleDateString()}</span>.
            </p>
          </div>
          <button
            onClick={handleCancelSubscription}
            disabled={loading}
            className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {subscription && subscription.status === "CANCELLED" && (
        <div className="w-full max-w-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
              Cancelled Subscription (Pending Expiry)
            </h3>
            <p className="text-xs text-zinc-500">
              Auto-renew is <span className="font-semibold text-red-600">OFF</span>. 
              Your Premium access will remain active until: <span className="font-mono">{new Date(subscription.expiresAt).toLocaleDateString()}</span>.
            </p>
          </div>
        </div>
      )}

      {/* PLAN COMPARISON CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl items-stretch">
        
        {/* FREE PLAN */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">Standard Access</span>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Free Plan</h2>
              <p className="text-xs text-zinc-500">Kickstart your systems learning journey.</p>
            </div>
            <div className="text-3xl font-black mt-2">
              $0 <span className="text-xs font-normal text-zinc-400 font-mono">/ Free forever</span>
            </div>
            
            {/* Features */}
            <ul className="flex flex-col gap-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Access to Basic HLD Topics (e.g. Consistent Hashing)
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Read Online Lesson notes
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Limited Video Previews
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-400 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-md cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="relative border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#18181b] p-8 rounded-md flex flex-col justify-between gap-8 shadow-md">
          
          <div className="absolute -top-3 -right-3 p-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-full border border-zinc-900 dark:border-zinc-100">
            <Star className="w-4 h-4 fill-current" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Recommended</span>
              <span className="text-3xs font-bold font-mono uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded-sm">
                Pass MAANG
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Premium Pass</h2>
              <p className="text-xs text-zinc-550">Unlimited preparation for Staff+ roles.</p>
            </div>
            <div className="text-3xl font-black mt-2">
              ₹999 <span className="text-xs font-normal text-zinc-400 font-mono">/ Month (Razorpay)</span>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-3 mt-4 border-t border-zinc-150 dark:border-zinc-800 pt-4">
              <li className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 font-semibold">
                <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                Unrestricted Access to All HLD & LLD Topics
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Unlock PDF Architectural blueprints & downloads
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Access all HD Video lectures on CDN edge
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Includes 1 Mock Interview credit per month
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-350">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Premium Slack community channel access
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleCheckout("PREMIUM_1M")}
              disabled={loading || subscription?.status === "ACTIVE"}
              className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-3 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50 cursor-pointer rounded-md shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Upgrading...
                </span>
              ) : subscription?.status === "ACTIVE" ? (
                "Subscribed (Auto-pay)"
              ) : (
                "Upgrade to Premium"
              )}
            </button>
            <div className="text-center">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-550">or pay directly via </span>
              <a
                href="https://razorpay.me/@beingsde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-zinc-650 dark:text-zinc-450 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Razorpay Payment Page <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL BENEFITS & FAQS */}
      <section className="w-full max-w-3xl flex flex-col gap-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 text-center mb-2">Platform Commitments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <Users className="w-5 h-5 text-zinc-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Mock Interviews</h4>
              <p className="text-3xs text-zinc-500 leading-relaxed mt-1">
                Conduct mock trials with Staff/Principal systems architects from target companies and get immediate, comprehensive scorecards.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-zinc-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Cancel Anytime Policy</h4>
              <p className="text-3xs text-zinc-500 leading-relaxed mt-1">
                No contracts. Pause or cancel your subscription directly from your settings panel instantly with zero exit fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BILLING & SUBSCRIPTION HISTORY */}
      {history && (
        <section className="w-full max-w-3xl flex flex-col gap-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <div className="flex flex-col gap-2 text-center mb-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-1.5">
              <History className="w-4 h-4 text-zinc-400" />
              Billing & Subscription History
            </h3>
            <p className="text-3xs text-zinc-550">
              Track all your past payments, receipts, and plan changes.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center border-b border-zinc-100 dark:border-zinc-850 gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("payments")}
              className={`pb-2 transition-all duration-300 relative cursor-pointer ${
                activeTab === "payments"
                  ? "text-zinc-900 dark:text-zinc-100 font-bold"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
            >
              Payment Log
              {activeTab === "payments" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-2 transition-all duration-300 relative cursor-pointer ${
                activeTab === "subscriptions"
                  ? "text-zinc-900 dark:text-zinc-100 font-bold"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
            >
              Subscription History
              {activeTab === "subscriptions" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              )}
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="w-full min-h-[150px] transition-all duration-300">
            {activeTab === "payments" ? (
              <div className="overflow-x-auto">
                {history.payments && history.payments.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-450 text-3xs font-mono uppercase tracking-wider">
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2">Transaction ID</th>
                        <th className="py-3 px-2">Method</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.payments.map((pmt) => (
                        <tr
                          key={pmt.id}
                          className="border-b border-zinc-100/50 dark:border-zinc-800/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                        >
                          <td className="py-3 px-2 text-zinc-600 dark:text-zinc-400 font-mono text-3xs">
                            {new Date(pmt.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 font-mono text-3xs text-zinc-500">
                            {pmt.razorpayPaymentId || pmt.razorpayOrderId || "N/A"}
                          </td>
                          <td className="py-3 px-2 capitalize text-zinc-500 font-mono text-3xs">
                            {pmt.paymentMethod || "Razorpay"}
                          </td>
                          <td className="py-3 px-2 font-bold font-mono text-3xs">
                            ₹{(pmt.amountInPaise / 100).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                                pmt.status === "CAPTURED"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/20"
                                  : pmt.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-250/20"
                                  : "bg-zinc-105 text-zinc-650 dark:bg-zinc-800/40 dark:text-zinc-400"
                              }`}
                            >
                              {pmt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-3xs text-zinc-450 gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/20">
                    <Clock className="w-5 h-5 text-zinc-300" />
                    <span>No payment records found.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {history.subscriptions && history.subscriptions.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-450 text-3xs font-mono uppercase tracking-wider">
                        <th className="py-3 px-2">Plan</th>
                        <th className="py-3 px-2">Sub ID</th>
                        <th className="py-3 px-2">Started At</th>
                        <th className="py-3 px-2">Expires At</th>
                        <th className="py-3 px-2">Auto-Renew</th>
                        <th className="py-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.subscriptions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-b border-zinc-100/50 dark:border-zinc-800/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                        >
                          <td className="py-3 px-2 font-bold text-zinc-800 dark:text-zinc-200 font-mono text-3xs">
                            {sub.tier}
                          </td>
                          <td className="py-3 px-2 font-mono text-3xs text-zinc-500">
                            {sub.razorpaySubscriptionId || "N/A"}
                          </td>
                          <td className="py-3 px-2 text-zinc-500 font-mono text-3xs">
                            {new Date(sub.startedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 text-zinc-500 font-mono text-3xs">
                            {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                                sub.autoRenew
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                              }`}
                            >
                              {sub.autoRenew ? "ON" : "OFF"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                                sub.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/20"
                                  : sub.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-250/20"
                                  : "bg-zinc-105 text-zinc-650 dark:bg-zinc-800/40 dark:text-zinc-400 border border-zinc-200/20"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-3xs text-zinc-450 gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/20">
                    <Calendar className="w-5 h-5 text-zinc-300" />
                    <span>No subscription history found.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Checkout Sandbox Simulation Modal */}
      {showSimulateModal && simulatedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-md font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Simulate Razorpay Payment
              </h2>
              <span className="text-2xs text-zinc-500 font-mono">
                Local Dev Sandbox (rzp_test_placeholder key detected)
              </span>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800 p-3 rounded-md text-3xs text-zinc-650 dark:text-zinc-400 font-mono flex flex-col gap-1.5">
              <div>Subscription ID: <strong>{simulatedOrder.subscriptionId}</strong></div>
              <div>Amount: <strong>₹{(simulatedOrder.amount / 100).toLocaleString("en-IN")}</strong></div>
              <div>Currency: <strong>{simulatedOrder.currency}</strong></div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              This is a sandbox simulation to test the full checkout and subscription verification flow. Clicking "Simulate Success" will make a mock call to our subscription verification API.
            </p>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-xs font-semibold px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSimulatedPayment}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Simulate Success
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
