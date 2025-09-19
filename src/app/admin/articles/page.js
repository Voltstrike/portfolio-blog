"use client";
import { useEffect, useState } from "react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });

  // Load from GitHub raw JSON
  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json",
        { cache: "no-store" }
      );
      const data = await res.json();
      setArticles(data);
    };
    load();
  }, []);

  // Save to GitHub via API
  const saveToGitHub = async (updated, msg) => {
    const res = await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/articles.json",
        content: updated, // ✅ send raw array, not stringified
        message: msg,
      }),
    });

    const result = await res.json();
    if (result.error) {
      alert("❌ Save failed: " + JSON.stringify(result.error));
    } else {
      setArticles(updated); // ✅ update state with saved version
    }
  };

  const handleAdd = async () => {
    if (!newArticle.title.trim() || !newArticle.content.trim()) {
      alert("Title and content are required!");
      return;
    }

    const article = {
      ...newArticle,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    const updated = [...articles, article];
    await saveToGitHub(updated, `Add article: ${article.title}`);

    setNewArticle({ title: "", content: "" });
  };

  const handleDelete = async (id) => {
    const updated = articles.filter((a) => a.id !== id);
    await saveToGitHub(updated, "Delete article");
  };

  const handleEdit = async (id, field, value) => {
    const updated = articles.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    await saveToGitHub(updated, "Edit article");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Articles</h1>

      {/* Add New */}
      <div className="mb-6 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <input
          className="border p-2 flex-1"
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul>
        {articles.map((a) => (
          <li
            key={a.id}
            className="p-3 mb-3 border rounded bg-gray-100 dark:bg-gray-800"
          >
            <input
              className="border p-1 mb-2 w-full"
              value={a.title}
              onChange={(e) => handleEdit(a.id, "title", e.target.value)}
            />
            <textarea
              className="border p-1 w-full mb-2"
              rows={4}
              value={a.content}
              onChange={(e) => handleEdit(a.id, "content", e.target.value)}
            />
            <button
              onClick={() => handleDelete(a.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
