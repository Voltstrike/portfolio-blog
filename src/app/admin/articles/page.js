"use client";
import { useEffect, useState } from "react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });

  // Load articles from GitHub raw
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

  const saveToGitHub = async (updated, msg) => {
    const res = await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/articles.json",
        content: updated,
        message: msg,
      }),
    });
    const result = await res.json();
    if (result.error) alert("❌ Failed: " + JSON.stringify(result.error));
    else setArticles(updated);
  };

  const handleAdd = async () => {
    const article = {
      ...newArticle,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updated = [...articles, article];
    await saveToGitHub(updated, "Add new article");
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
      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <input
          className="border p-2 mr-2"
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
              className="border p-1 mr-2"
              value={a.title}
              onChange={(e) => handleEdit(a.id, "title", e.target.value)}
            />
            <textarea
              className="border p-1 mr-2 w-full"
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
