"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search, Check, AlertTriangle, Eye } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface Topic {
  id?: string;
  title: string;
  slug: string;
  description: string;
  contentMarkdown: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: string;
  estimatedTimeMinutes: number;
  tags: string[];
  prerequisites: string[];
  videoUrl?: string;
  pdfUrl?: string;
  isArchived: boolean;
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [category, setCategory] = useState("");
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState(30);
  const [tagsInput, setTagsInput] = useState("");
  const [prereqInput, setPrereqInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/topics?size=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTopics(data.content || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setTitle(topic.title);
    setSlug(topic.slug);
    setDescription(topic.description);
    setContentMarkdown(topic.contentMarkdown || "");
    setDifficulty(topic.difficulty);
    setCategory(topic.category);
    setEstimatedTimeMinutes(topic.estimatedTimeMinutes);
    setTagsInput(topic.tags ? topic.tags.join(", ") : "");
    setPrereqInput(topic.prerequisites ? topic.prerequisites.join(", ") : "");
    setVideoUrl(topic.videoUrl || "");
    setPdfUrl(topic.pdfUrl || "");
    setError("");
    setFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTopic(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setContentMarkdown("");
    setDifficulty("EASY");
    setCategory("");
    setEstimatedTimeMinutes(30);
    setTagsInput("");
    setPrereqInput("");
    setVideoUrl("");
    setPdfUrl("");
    setError("");
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    const payload: Topic = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      contentMarkdown,
      difficulty,
      category,
      estimatedTimeMinutes: Number(estimatedTimeMinutes),
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      prerequisites: prereqInput.split(",").map(t => t.trim()).filter(Boolean),
      videoUrl: videoUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      isArchived: editingTopic ? editingTopic.isArchived : false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingTopic ? `${API_BASE}/topics/${editingTopic.id}` : `${API_BASE}/topics`;
      const method = editingTopic ? "PUT" : "POST";

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
        throw new Error(err.message || "Failed to save topic");
      }

      setFormOpen(false);
      fetchTopics();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this topic?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/topics/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTopics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-mono">HLD Topics Database</h2>
          <p className="text-xs text-zinc-500">Insert or update High-Level Design templates.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-zinc-50 hover:opacity-90 text-zinc-50 dark:text-zinc-950 font-bold uppercase tracking-wider text-2xs rounded transition-all"
        >
          <Plus className="w-4 h-4" /> Add HLD Topic
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

      {/* Grid list of topics */}
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
                <th className="p-3">Difficulty</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((topic) => (
                <tr key={topic.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    <div className="flex flex-col">
                      <span>{topic.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono font-normal">/{topic.slug}</span>
                    </div>
                  </td>
                  <td className="p-3 text-zinc-500">{topic.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      topic.difficulty === "EASY" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" :
                      topic.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400" :
                      "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                    }`}>
                      {topic.difficulty}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(topic)}
                      className="p-1 hover:text-zinc-900 dark:hover:text-zinc-50 text-zinc-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id!)}
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
                {editingTopic ? "Update HLD Record" : "Create HLD Record"}
              </span>
              <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
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
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded dark:bg-zinc-900"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Databases & Storage"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Time (mins)</label>
                  <input
                    type="number"
                    required
                    value={estimatedTimeMinutes}
                    onChange={(e) => setEstimatedTimeMinutes(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Redis, Caching, Databases"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Prerequisites (comma separated)</label>
                  <input
                    type="text"
                    value={prereqInput}
                    onChange={(e) => setPrereqInput(e.target.value)}
                    placeholder="Consistent Hashing, TCP"
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Video CDN URL</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">PDF Blueprint URL</label>
                  <input
                    type="text"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono font-bold text-zinc-400 uppercase block mb-1">Content Markdown</label>
                <textarea
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
