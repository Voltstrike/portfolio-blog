"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchArticles = async () => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json"
      );
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Error loading articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 🔹 Commit changes to GitHub
  const commitChanges = async (updated, msg) => {
    try {
      const res = await fetch("/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/articles.json",
          content: JSON.stringify(updated, null, 2),
          message: msg,
        }),
      });

      if (res.ok) {
        setArticles(updated);
        setMessage("✅ Saved successfully!");
      } else {
        const result = await res.json();
        console.error("Commit failed:", result);
        setMessage("❌ Commit failed. Check console.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  // 🔹 Add
  const addArticle = async () => {
    if (!newArticle.title.trim() || !newArticle.content.trim()) return;

    setLoading(true);
    setMessage("");

    const slug = slugify(newArticle.title, { lower: true, strict: true });
    const updated = [
      ...articles,
      { ...newArticle, slug, createdAt: new Date().toISOString() },
    ];

    await commitChanges(updated, `Add article: ${newArticle.title}`);
    setNewArticle({ title: "", content: "" });
    setLoading(false);
  };

  // 🔹 Update
  const saveEdit = async (index) => {
    const updated = [...articles];
    updated[index].slug = slugify(updated[index].title, {
      lower: true,
      strict: true,
    });
    await commitChanges(updated, `Update article: ${updated[index].title}`);
    setEditingIndex(null);
  };

  // 🔹 Delete
  const deleteArticle = async (index) => {
    const updated = articles.filter((_, i) => i !== index);
    await commitChanges(updated, "Delete article");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin: Articles</h1>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      {/* Add Form */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
          className="w-full border p-2 rounded"
          rows="4"
        />
        <button
          onClick={addArticle}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Article"}
        </button>
      </div>

      {/* Article List */}
      <ul className="space-y-3">
        {articles.map((a, i) => (
          <li
            key={i}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded shadow"
          >
            {editingIndex === i ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={a.title}
                  onChange={(e) => {
                    const updated = [...articles];
                    updated[i].title = e.target.value;
                    setArticles(updated);
                  }}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  value={a.content}
                  onChange={(e) => {
                    const updated = [...articles];
                    updated[i].content = e.target.value;
                    setArticles(updated);
                  }}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
                <button
                  onClick={() => saveEdit(i)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <strong>{a.title}</strong>
                <p className="text-sm text-gray-500">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => setEditingIndex(i)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArticle(i)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
