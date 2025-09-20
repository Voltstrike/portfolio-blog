"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";


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


  async function handleAddArticle(newArticle) {
  const articleWithSlug = {
    ...newArticle,
    slug: slugify(newArticle.title, { lower: true, strict: true }),
    date: new Date().toISOString(),
  };

  const res = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleWithSlug),
  });

  if (res.ok) {
    alert("✅ Article saved successfully!");
    loadArticles(); // refresh list after commit
  } else {
    alert("❌ Failed to save article.");
  }
}

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
