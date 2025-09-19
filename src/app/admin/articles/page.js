"use client";
import { useEffect, useState } from "react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load articles.json
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/articles.json");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles", err);
      }
    };
    load();
  }, []);

  // Save to GitHub via API
  const saveArticles = async (updated) => {
    setArticles(updated);
    await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/articles.json",
        content: JSON.stringify(updated, null, 2),
        message: "Update articles.json",
      }),
    });
  };

  const addArticle = async () => {
    if (!title.trim() || !content.trim()) return;
    const newArticle = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
    };
    const updated = [...articles, newArticle];
    await saveArticles(updated);
    setTitle("");
    setContent("");
  };

  const deleteArticle = async (id) => {
    const updated = articles.filter((a) => a.id !== id);
    await saveArticles(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Articles</h1>

      {/* Add New */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={addArticle}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {articles.map((a) => (
          <li key={a.id} className="border p-4 rounded">
            <h3 className="font-bold">{a.title}</h3>
            <textarea
              className="w-full border mt-2 p-2"
              value={a.content}
              onChange={(e) =>
                saveArticles(
                  articles.map((x) =>
                    x.id === a.id ? { ...x, content: e.target.value } : x
                  )
                )
              }
            />
            <button
              onClick={() => deleteArticle(a.id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
