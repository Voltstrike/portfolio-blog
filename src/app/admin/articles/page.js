"use client";
import { useEffect, useState } from "react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function loadArticles() {
    const res = await fetch("/api/articles");
    const data = await res.json();
    setArticles(data);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  const handleAdd = async () => {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      alert("✅ Article added and saved to GitHub!");
      await loadArticles();
      setTitle("");
      setContent("");
    }
  };

  const handleUpdate = async (article) => {
    const res = await fetch("/api/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });
    if (res.ok) await loadArticles();
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await loadArticles();
  };

  return (
    <div>
      <h1>Admin – Articles</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button onClick={handleAdd}>Add Article</button>

      <ul>
        {articles.map((a) => (
          <li key={a.id}>
            <input
              value={a.title}
              onChange={(e) => handleUpdate({ ...a, title: e.target.value })}
            />
            <textarea
              value={a.content}
              onChange={(e) => handleUpdate({ ...a, content: e.target.value })}
            />
            <button onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
