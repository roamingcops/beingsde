"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface DsaQuestion {
  id?: string;
  questionId: number;
  title: string;
  tag: string;
  difficulty: string;
  tabGroup: string; // "ds" or "algo"
  summary: string;
  keyPoints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  isArchived: boolean;
}

export default function AdminDsaPage() {
  const [questions, setQuestions] = useState<DsaQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DsaQuestion | null>(null);
  
  const [questionId, setQuestionId] = useState(1);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [tabGroup, setTabGroup] = useState("ds");
  const [summary, setSummary] = useState("");
  const [keyPointsInput, setKeyPointsInput] = useState("");
  const [approach, setApproach] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("O(n)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
  const [pattern, setPattern] = useState("");
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/dsa`, {
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

  const handleEdit = (q: DsaQuestion) => {
    setEditingQuestion(q);
    setQuestionId(q.questionId);
    setTitle(q.title);
    setTag(q.tag);
    setDifficulty(q.difficulty);
    setTabGroup(q.tabGroup || "ds");
    setSummary(q.summary);
    setKeyPointsInput(q.keyPoints ? q.keyPoints.join("\n") : "");
    setApproach(q.approach || "");
    setTimeComplexity(q.timeComplexity || "O(n)");
    setSpaceComplexity(q.spaceComplexity || "O(1)");
    setPattern(q.pattern || "");
    setError("");
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingQuestion(null);
    setQuestionId(questions.length + 1);
    setTitle("");
    setTag("");
    setDifficulty("Medium");
    setTabGroup("ds");
    setSummary("");
    setKeyPointsInput("");
    setApproach("");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(1)");
    setPattern("");
    setError("");
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    const payload: DsaQuestion = {
      questionId: Number(questionId),
      title,
      tag,
      difficulty,
      tabGroup,
      summary,
      keyPoints: keyPointsInput.split("\n").map(k => k.trim()).filter(Boolean),
      approach,
      timeComplexity,
      spaceComplexity,
      pattern,
      isArchived: editingQuestion ? editingQuestion.isArchived : false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingQuestion ? `${API_BASE}/dsa/${editingQuestion.id}` : `${API_BASE}/dsa`;
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
        throw new Error(err.message || "Failed to save DSA question");
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
    if (!confirm("Are you sure you want to archive this exercise?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/dsa/${id}`, {
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
    q.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.pattern.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-mono">DSA Exercises Database</h2>
          <p className="text-xs text-zinc-500">Insert or update Data Structures & Algorithms challenges.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-zinc-50 hover:opacity-90 text-zinc-50 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-all"
        >
          <Plus className="w-4 h-4" /> Add DSA Question
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter by title, tag, or pattern..."
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
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Group</th>
                <th className="p-3">Tag</th>
                <th className="p-3">Pattern</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-mono text-zinc-400">{item.questionId}</td>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</td>
                  <td className="p-3 font-mono uppercase text-zinc-400">{item.tabGroup}</td>
                  <td className="p-3 text-zinc-500">{item.tag}</td>
                  <td className="p-3 text-zinc-500 font-mono">{item.pattern || "N/A"}</td>
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
                  <td colSpan={6} className="p-8 text-center text-zinc-400 font-mono">No matching records found.</td>
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
                {editingQuestion ? "Update DSA Record" : "Create DSA Record"}
              </span>
              <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Question ID</label>
                  <input
                    type="number"
                    required
                    value={questionId}
                    onChange={(e) => setQuestionId(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Tab Group</label>
                  <select
                    value={tabGroup}
                    onChange={(e) => setTabGroup(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded dark:bg-zinc-900"
                  >
                    <option value="ds">Data Structures (ds)</option>
                    <option value="algo">Algorithms (algo)</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Tag</label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Array"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Pattern</label>
                  <input
                    type="text"
                    required
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Boyer-Moore Voting"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Summary</label>
                <textarea
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16 resize-none"
                />
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Key Points (one per line)</label>
                <textarea
                  value={keyPointsInput}
                  onChange={(e) => setKeyPointsInput(e.target.value)}
                  placeholder="Uses O(1) space&#10;Verify candidates in a second pass"
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20 font-mono text-2xs"
                />
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Approach Explanation</label>
                <textarea
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    required
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    placeholder="O(n)"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded font-mono text-2xs"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    required
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    placeholder="O(1)"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded font-mono text-2xs"
                  />
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
