"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/data/articles.json");
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

  const addArticle = () => {
    if (!title.trim() || !content.trim()) return;
    const newArticle = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      slug: slugify(title), // ✅ generate slug
    };
    const updated = [...articles, newArticle];
    setArticles(updated);
    saveToGitHub("articles.json", updated);
    setTitle("");
    setContent("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Articles</h1>

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
          onClick={addArticle}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ➕ Add Article
        </button>
      </div>

      <ul className="space-y-4">
        {articles.map((a) => (
          <li key={a.id} className="p-4 bg-gray-100 rounded">
            <strong>{a.title}</strong> ({a.slug})
          </li>
        ))}
      </ul>
    </div>
  );
}
