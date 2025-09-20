"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
  });

  // ✅ Add handler
  const handleAdd = async () => {
    if (!newArticle.title || !newArticle.content) return;

    const slug = slugify(newArticle.title, { lower: true, strict: true });
    const article = {
      id: Date.now(),
      slug,
      ...newArticle,
      date: new Date().toISOString(),
    };

    try {
      // Call your API here to commit to GitHub
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (!res.ok) throw new Error("Failed to save article");

      // Update UI state only after commit succeeded
      setArticles([...articles, article]);
      setNewArticle({ title: "", content: "" });
      alert("✅ Article saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save article");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage Articles</h1>

      <div className="my-4">
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <textarea
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Article
        </button>
      </div>

      <ul>
        {articles.map((article) => (
          <li key={article.id} className="border-b py-2">
            {article.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
