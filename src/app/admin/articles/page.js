"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Load existing articles from GitHub
  useEffect(() => {
    const loadArticles = async () => {
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
    loadArticles();
  }, []);

  // 🔹 Add Article
  const addArticle = async () => {
    if (!newArticle.title.trim() || !newArticle.content.trim()) return;

    setLoading(true);
    setMessage("");

    const slug = slugify(newArticle.title, { lower: true, strict: true });
    const updated = [
      ...articles,
      {
        ...newArticle,
        slug,
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      const res = await fetch("/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/articles.json",
          content: JSON.stringify(updated, null, 2),
          message: `Add article: ${newArticle.title}`,
        }),
      });

      if (res.ok) {
        setArticles(updated);
        setNewArticle({ title: "", content: "" });
        setMessage("✅ Article committed successfully!");
      } else {
        const result = await res.json();
        console.error("Commit failed:", result);
        setMessage("❌ Commit failed. Check console.");
      }
    } catch (err) {
      console.error("Error adding article:", err);
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
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
            <strong>{a.title}</strong>
            <p className="text-sm text-gray-500">
              {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
