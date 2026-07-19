"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface HldQuestion {
  id?: string;
  questionId: number;
  title: string;
  category: string;
  difficulty: string;
  summary: string;
  contentMarkdown: string;
  isArchived: boolean;
}

export default function AdminHldQuestionsPage() {
  const [questions, setQuestions] = useState<HldQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<HldQuestion | null>(null);
  
  const [questionId, setQuestionId] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Databases");
  const [difficulty, setDifficulty] = useState("Medium");
  const [summary, setSummary] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/hld-questions`, {
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

  const handleEdit = (q: HldQuestion) => {
    setEditingQuestion(q);
    setQuestionId(q.questionId);
    setTitle(q.title);
    setCategory(q.category);
    setDifficulty(q.difficulty);
    setSummary(q.summary);
    setContentMarkdown(q.contentMarkdown || "");
    setError("");
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingQuestion(null);
    setQuestionId(questions.length + 1);
    setTitle("");
    setCategory("Databases");
    setDifficulty("Medium");
    setSummary("");
    setContentMarkdown("");
    setError("");
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    const payload: HldQuestion = {
      questionId: Number(questionId),
      title,
      category,
      difficulty,
      summary,
      contentMarkdown,
      isArchived: editingQuestion ? editingQuestion.isArchived : false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingQuestion ? `${API_BASE}/hld-questions/${editingQuestion.id}` : `${API_BASE}/hld-questions`;
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
        throw new Error(err.message || "Failed to save HLD question");
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
      const res = await sessionAwareFetch(`${API_BASE}/hld-questions/${id}`, {
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
          <h2 className="text-xl font-bold tracking-tight font-mono">HLD Questions Database</h2>
          <p className="text-xs text-zinc-500">Insert or update High-Level Design (System Design) Q&A cards.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-zinc-50 hover:opacity-90 text-zinc-50 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-all"
        >
          <Plus className="w-4 h-4" /> Add HLD Q
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
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-mono text-zinc-400">{item.questionId}</td>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</td>
                  <td className="p-3 text-zinc-500">{item.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.difficulty.toLowerCase() === "easy" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" :
                      item.difficulty.toLowerCase() === "medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400" :
                      "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                    }`}>
                      {item.difficulty}
                    </span>
                  </td>
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
                  <td colSpan={5} className="p-8 text-center text-zinc-400 font-mono">No matching records found.</td>
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
                {editingQuestion ? "Update HLD Q Record" : "Create HLD Q Record"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded dark:bg-zinc-900"
                  >
                    <option value="Databases">Databases</option>
                    <option value="Scaling">Scaling</option>
                    <option value="Security & Auth">Security & Auth</option>
                    <option value="Protocols">Protocols & Real-Time</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded dark:bg-zinc-900"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
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
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Content Markdown</label>
                <textarea
                  required
                  value={contentMarkdown}
                  onChange={(e) => setContentMarkdown(e.target.value)}
                  placeholder="# Enter your markdown text here..."
                  className="w-full p-3 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-60 font-mono text-2xs"
                />
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
