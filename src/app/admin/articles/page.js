"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  // Load articles
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


  const saveToGitHub = async (file, updated) => {
    await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: `data/${file}`,
        content: JSON.stringify(updated, null, 2),
        message: `Update ${file} via Admin`,
      }),
    });
  };

  // Add or update article
  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    let updated;
    if (editId) {
      // Edit mode
      updated = articles.map((a) =>
        a.id === editId ? { ...a, title, content, slug: slugify(title) } : a
      );
      setEditId(null);
    } else {
      // Add mode
      const newArticle = {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString(),
        slug: slugify(title),
      };
      updated = [...articles, newArticle];
    }

    setArticles(updated);
    saveToGitHub("articles.json", updated);
    setTitle("");
    setContent("");
  };

  // Delete article
  const handleDelete = (id) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    saveToGitHub("articles.json", updated);
  };

  // Load article into form for editing
  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditId(article.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Articles</h1>

      {/* Form */}
      <div className="mb-6 space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editId ? "✏️ Update Article" : "➕ Add Article"}
        </button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {articles.map((a) => (
          <li
            key={a.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              <strong>{a.title}</strong> <span className="text-sm">({a.slug})</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(a)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
