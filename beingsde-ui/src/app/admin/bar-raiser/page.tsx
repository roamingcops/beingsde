"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

type Level = "SDE1" | "SDE2" | "SDE3" | "Principal";

interface LevelAnswer {
  level: Level;
  focus: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyTakeaway: string;
}

interface BarRaiserQuestion {
  id?: string;
  title: string;
  category: string;
  principle: string;
  why: string;
  redFlags: string[];
  greenFlags: string[];
  levels: LevelAnswer[];
  isArchived: boolean;
}

export default function AdminBarRaiserPage() {
  const [questions, setQuestions] = useState<BarRaiserQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BarRaiserQuestion | null>(null);
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Ownership");
  const [principle, setPrinciple] = useState("");
  const [why, setWhy] = useState("");
  const [redFlagsInput, setRedFlagsInput] = useState("");
  const [greenFlagsInput, setGreenFlagsInput] = useState("");
  
  // Level answers state
  const [sde1Focus, setSde1Focus] = useState("");
  const [sde1Situation, setSde1Situation] = useState("");
  const [sde1Task, setSde1Task] = useState("");
  const [sde1Action, setSde1Action] = useState("");
  const [sde1Result, setSde1Result] = useState("");
  const [sde1Takeaway, setSde1Takeaway] = useState("");

  const [sde2Focus, setSde2Focus] = useState("");
  const [sde2Situation, setSde2Situation] = useState("");
  const [sde2Task, setSde2Task] = useState("");
  const [sde2Action, setSde2Action] = useState("");
  const [sde2Result, setSde2Result] = useState("");
  const [sde2Takeaway, setSde2Takeaway] = useState("");

  const [sde3Focus, setSde3Focus] = useState("");
  const [sde3Situation, setSde3Situation] = useState("");
  const [sde3Task, setSde3Task] = useState("");
  const [sde3Action, setSde3Action] = useState("");
  const [sde3Result, setSde3Result] = useState("");
  const [sde3Takeaway, setSde3Takeaway] = useState("");

  const [prFocus, setPrFocus] = useState("");
  const [prSituation, setPrSituation] = useState("");
  const [prTask, setPrTask] = useState("");
  const [prAction, setPrAction] = useState("");
  const [prResult, setPrResult] = useState("");
  const [prTakeaway, setPrTakeaway] = useState("");

  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/bar-raiser`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleEdit = (q: BarRaiserQuestion) => {
    setEditingQuestion(q);
    setTitle(q.title);
    setCategory(q.category);
    setPrinciple(q.principle || "");
    setWhy(q.why || "");
    setRedFlagsInput(q.redFlags ? q.redFlags.join("\n") : "");
    setGreenFlagsInput(q.greenFlags ? q.greenFlags.join("\n") : "");

    // Populate level answers
    const s1 = q.levels?.find(l => l.level === "SDE1");
    setSde1Focus(s1?.focus || "");
    setSde1Situation(s1?.situation || "");
    setSde1Task(s1?.task || "");
    setSde1Action(s1?.action || "");
    setSde1Result(s1?.result || "");
    setSde1Takeaway(s1?.keyTakeaway || "");

    const s2 = q.levels?.find(l => l.level === "SDE2");
    setSde2Focus(s2?.focus || "");
    setSde2Situation(s2?.situation || "");
    setSde2Task(s2?.task || "");
    setSde2Action(s2?.action || "");
    setSde2Result(s2?.result || "");
    setSde2Takeaway(s2?.keyTakeaway || "");

    const s3 = q.levels?.find(l => l.level === "SDE3");
    setSde3Focus(s3?.focus || "");
    setSde3Situation(s3?.situation || "");
    setSde3Task(s3?.task || "");
    setSde3Action(s3?.action || "");
    setSde3Result(s3?.result || "");
    setSde3Takeaway(s3?.keyTakeaway || "");

    const pr = q.levels?.find(l => l.level === "Principal");
    setPrFocus(pr?.focus || "");
    setPrSituation(pr?.situation || "");
    setPrTask(pr?.task || "");
    setPrAction(pr?.action || "");
    setPrResult(pr?.result || "");
    setPrTakeaway(pr?.keyTakeaway || "");

    setError("");
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingQuestion(null);
    setTitle("");
    setCategory("Ownership");
    setPrinciple("");
    setWhy("");
    setRedFlagsInput("");
    setGreenFlagsInput("");

    setSde1Focus(""); setSde1Situation(""); setSde1Task(""); setSde1Action(""); setSde1Result(""); setSde1Takeaway("");
    setSde2Focus(""); setSde2Situation(""); setSde2Task(""); setSde2Action(""); setSde2Result(""); setSde2Takeaway("");
    setSde3Focus(""); setSde3Situation(""); setSde3Task(""); setSde3Action(""); setSde3Result(""); setSde3Takeaway("");
    setPrFocus(""); setPrSituation(""); setPrTask(""); setPrAction(""); setPrResult(""); setPrTakeaway("");

    setError("");
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    const levels: LevelAnswer[] = [
      { level: "SDE1", focus: sde1Focus, situation: sde1Situation, task: sde1Task, action: sde1Action, result: sde1Result, keyTakeaway: sde1Takeaway },
      { level: "SDE2", focus: sde2Focus, situation: sde2Situation, task: sde2Task, action: sde2Action, result: sde2Result, keyTakeaway: sde2Takeaway },
      { level: "SDE3", focus: sde3Focus, situation: sde3Situation, task: sde3Task, action: sde3Action, result: sde3Result, keyTakeaway: sde3Takeaway },
      { level: "Principal", focus: prFocus, situation: prSituation, task: prTask, action: prAction, result: prResult, keyTakeaway: prTakeaway },
    ];

    const payload: BarRaiserQuestion = {
      title,
      category,
      principle,
      why,
      redFlags: redFlagsInput.split("\n").map(f => f.trim()).filter(Boolean),
      greenFlags: greenFlagsInput.split("\n").map(f => f.trim()).filter(Boolean),
      levels,
      isArchived: editingQuestion ? editingQuestion.isArchived : false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingQuestion ? `${API_BASE}/bar-raiser/${editingQuestion.id}` : `${API_BASE}/bar-raiser`;
      const method = editingQuestion ? "PUT" : "POST";

      const res = await sessionAwareFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save question");
      }

      setFormOpen(false);
      fetchQuestions();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this question?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/bar-raiser/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-mono">Bar Raiser Qs Database</h2>
          <p className="text-xs text-zinc-500">Insert or update leadership principle behavioral templates.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-zinc-50 hover:opacity-90 text-zinc-50 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-all"
        >
          <Plus className="w-4 h-4" /> Add Bar Raiser Q
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors"
        />
      </div>

      {/* List Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full"></div>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800/80 rounded overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Principle</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</td>
                  <td className="p-3 text-zinc-500">{item.category}</td>
                  <td className="p-3 text-zinc-400 font-mono">{item.principle}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 hover:text-zinc-900 dark:hover:text-zinc-50 text-zinc-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="p-1 hover:text-rose-600 text-zinc-400 transition-colors"
                      title="Archive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400 font-mono">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded shadow-md flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                {editingQuestion ? "Update Bar Raiser Record" : "Create Bar Raiser Record"}
              </span>
              <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Title (Question Prompt)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded dark:bg-zinc-900"
                  >
                    <option value="Ownership">Ownership</option>
                    <option value="Conflict">Conflict & Backbone</option>
                    <option value="Delivery">Delivery & Trade-offs</option>
                    <option value="Ambiguity">Ambiguity</option>
                    <option value="Technical Leadership">Technical Leadership</option>
                    <option value="Customer Obsession">Customer Obsession</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Core Principle</label>
                  <input
                    type="text"
                    required
                    value={principle}
                    onChange={(e) => setPrinciple(e.target.value)}
                    placeholder="Have Backbone; Disagree and Commit"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Why Bar Raisers Ask This</label>
                <textarea
                  required
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Red Flags (one per line)</label>
                  <textarea
                    value={redFlagsInput}
                    onChange={(e) => setRedFlagsInput(e.target.value)}
                    placeholder="Blamed teammates&#10;Avoided conflict silently"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20 font-mono text-2xs"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Green Flags (one per line)</label>
                  <textarea
                    value={greenFlagsInput}
                    onChange={(e) => setGreenFlagsInput(e.target.value)}
                    placeholder="Used metric data&#10;Respectfully disagreed"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20 font-mono text-2xs"
                  />
                </div>
              </div>

              {/* level Answers tabs */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-4">
                <span className="font-mono font-bold text-zinc-400 uppercase block">Level STAR Answers</span>
                
                {/* SDE 1 SECTION */}
                <div className="border border-zinc-200 dark:border-zinc-850 p-4 rounded bg-zinc-500/5">
                  <span className="font-bold text-xs text-emerald-500 block mb-2 font-mono">SDE 1 (Junior Level)</span>
                  <div className="space-y-3">
                    <input type="text" placeholder="Focus Theme" value={sde1Focus} onChange={e => setSde1Focus(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded" />
                    <textarea placeholder="Situation" value={sde1Situation} onChange={e => setSde1Situation(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Task" value={sde1Task} onChange={e => setSde1Task(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Action" value={sde1Action} onChange={e => setSde1Action(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20" />
                    <textarea placeholder="Result" value={sde1Result} onChange={e => setSde1Result(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Key Takeaway" value={sde1Takeaway} onChange={e => setSde1Takeaway(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                  </div>
                </div>

                {/* SDE 2 SECTION */}
                <div className="border border-zinc-200 dark:border-zinc-850 p-4 rounded bg-zinc-500/5">
                  <span className="font-bold text-xs text-sky-500 block mb-2 font-mono">SDE 2 (Mid-Level)</span>
                  <div className="space-y-3">
                    <input type="text" placeholder="Focus Theme" value={sde2Focus} onChange={e => setSde2Focus(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded" />
                    <textarea placeholder="Situation" value={sde2Situation} onChange={e => setSde2Situation(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Task" value={sde2Task} onChange={e => setSde2Task(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Action" value={sde2Action} onChange={e => setSde2Action(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20" />
                    <textarea placeholder="Result" value={sde2Result} onChange={e => setSde2Result(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Key Takeaway" value={sde2Takeaway} onChange={e => setSde2Takeaway(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                  </div>
                </div>

                {/* SDE 3 SECTION */}
                <div className="border border-zinc-200 dark:border-zinc-850 p-4 rounded bg-zinc-500/5">
                  <span className="font-bold text-xs text-violet-500 block mb-2 font-mono">SDE 3 (Senior Level)</span>
                  <div className="space-y-3">
                    <input type="text" placeholder="Focus Theme" value={sde3Focus} onChange={e => setSde3Focus(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded" />
                    <textarea placeholder="Situation" value={sde3Situation} onChange={e => setSde3Situation(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Task" value={sde3Task} onChange={e => setSde3Task(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Action" value={sde3Action} onChange={e => setSde3Action(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20" />
                    <textarea placeholder="Result" value={sde3Result} onChange={e => setSde3Result(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Key Takeaway" value={sde3Takeaway} onChange={e => setSde3Takeaway(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                  </div>
                </div>

                {/* PRINCIPAL SECTION */}
                <div className="border border-zinc-200 dark:border-zinc-850 p-4 rounded bg-zinc-500/5">
                  <span className="font-bold text-xs text-amber-500 block mb-2 font-mono">Principal (Staff/Principal Level)</span>
                  <div className="space-y-3">
                    <input type="text" placeholder="Focus Theme" value={prFocus} onChange={e => setPrFocus(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded" />
                    <textarea placeholder="Situation" value={prSituation} onChange={e => setPrSituation(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Task" value={prTask} onChange={e => setPrTask(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Action" value={prAction} onChange={e => setPrAction(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20" />
                    <textarea placeholder="Result" value={prResult} onChange={e => setPrResult(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                    <textarea placeholder="Key Takeaway" value={prTakeaway} onChange={e => setPrTakeaway(e.target.value)} className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16" />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-2xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded border border-rose-200 dark:border-rose-800">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider text-2xs rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-colors disabled:opacity-50"
                >
                  {saveLoading ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
