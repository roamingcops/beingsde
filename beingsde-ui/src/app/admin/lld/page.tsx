"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface LldItem {
  id?: string;
  questionId: number;
  title: string;
  slug: string;
  difficulty: string;
  tag: string;
  patterns: string[];
  summary: string;
  requirements: string[];
  erDiagram: string;
  classes: string[];
  languages: {
    java: string;
    cpp: string;
    python: string;
  };
  approach: string;
  isArchived: boolean;
}

export default function AdminLldPage() {
  const [items, setItems] = useState<LldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LldItem | null>(null);
  
  const [questionId, setQuestionId] = useState(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tag, setTag] = useState("");
  const [patternsInput, setPatternsInput] = useState("");
  const [summary, setSummary] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [erDiagram, setErDiagram] = useState("");
  const [classesInput, setClassesInput] = useState("");
  const [javaCode, setJavaCode] = useState("");
  const [cppCode, setCppCode] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [approach, setApproach] = useState("");
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/lld`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: LldItem) => {
    setEditingItem(item);
    setQuestionId(item.questionId);
    setTitle(item.title);
    setSlug(item.slug);
    setDifficulty(item.difficulty);
    setTag(item.tag);
    setPatternsInput(item.patterns ? item.patterns.join(", ") : "");
    setSummary(item.summary);
    setRequirementsInput(item.requirements ? item.requirements.join("\n") : "");
    setErDiagram(item.erDiagram || "");
    setClassesInput(item.classes ? item.classes.join(", ") : "");
    setJavaCode(item.languages?.java || "");
    setCppCode(item.languages?.cpp || "");
    setPythonCode(item.languages?.python || "");
    setApproach(item.approach);
    setError("");
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setQuestionId(items.length + 1);
    setTitle("");
    setSlug("");
    setDifficulty("Easy");
    setTag("");
    setPatternsInput("");
    setSummary("");
    setRequirementsInput("");
    setErDiagram("");
    setClassesInput("");
    setJavaCode("");
    setCppCode("");
    setPythonCode("");
    setApproach("");
    setError("");
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    const payload: LldItem = {
      questionId: Number(questionId),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      difficulty,
      tag,
      patterns: patternsInput.split(",").map(p => p.trim()).filter(Boolean),
      summary,
      requirements: requirementsInput.split("\n").map(r => r.trim()).filter(Boolean),
      erDiagram,
      classes: classesInput.split(",").map(c => c.trim()).filter(Boolean),
      languages: {
        java: javaCode,
        cpp: cppCode,
        python: pythonCode
      },
      approach,
      isArchived: editingItem ? editingItem.isArchived : false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingItem ? `${API_BASE}/lld/${editingItem.id}` : `${API_BASE}/lld`;
      const method = editingItem ? "PUT" : "POST";

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
        throw new Error(err.message || "Failed to save LLD question");
      }

      setFormOpen(false);
      fetchItems();
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
      const res = await sessionAwareFetch(`${API_BASE}/lld/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-mono">LLD Exercises Database</h2>
          <p className="text-xs text-zinc-500">Insert or update Low-Level / Object-Oriented Design challenges.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-zinc-50 hover:opacity-90 text-zinc-50 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-all"
        >
          <Plus className="w-4 h-4" /> Add LLD Exercise
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter by title or tag..."
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
                <th className="p-3">Tag</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-mono text-zinc-400">{item.questionId}</td>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono font-normal">/{item.slug}</span>
                    </div>
                  </td>
                  <td className="p-3 text-zinc-500">{item.tag}</td>
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
                {editingItem ? "Update LLD Record" : "Create LLD Record"}
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
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="Leave empty to auto-generate"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
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
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Tag</label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Game Design"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Design Patterns (comma separated)</label>
                  <input
                    type="text"
                    value={patternsInput}
                    onChange={(e) => setPatternsInput(e.target.value)}
                    placeholder="State, Observer, Singleton"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Core Classes (comma separated)</label>
                  <input
                    type="text"
                    value={classesInput}
                    onChange={(e) => setClassesInput(e.target.value)}
                    placeholder="Board, Cell, Player"
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
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Requirements (one per line)</label>
                <textarea
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  placeholder="Support custom board sizes&#10;Verify win condition in O(1)"
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-20 font-mono text-2xs"
                />
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">ER Diagram Text (Mermaid string)</label>
                <textarea
                  value={erDiagram}
                  onChange={(e) => setErDiagram(e.target.value)}
                  placeholder="Board [1] <---> [*] Cell"
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16 font-mono text-2xs"
                />
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Approach Narrative</label>
                <textarea
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  placeholder="Explain the O(1) algorithm approach here..."
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16"
                />
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <span className="font-mono font-bold text-zinc-400 uppercase block mb-2">Code Snippets</span>
                <div className="space-y-3">
                  <div>
                    <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Java</label>
                    <textarea
                      value={javaCode}
                      onChange={(e) => setJavaCode(e.target.value)}
                      className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-32 font-mono text-3xs"
                    />
                  </div>
                  <div>
                    <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">C++</label>
                    <textarea
                      value={cppCode}
                      onChange={(e) => setCppCode(e.target.value)}
                      className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-32 font-mono text-3xs"
                    />
                  </div>
                  <div>
                    <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Python</label>
                    <textarea
                      value={pythonCode}
                      onChange={(e) => setPythonCode(e.target.value)}
                      className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-32 font-mono text-3xs"
                    />
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
