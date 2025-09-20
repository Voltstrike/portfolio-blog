"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
  });
  const [editingArticle, setEditingArticle] = useState(null);

  // ✅ Load articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    };
    fetchArticles();
  }, []);

  // ✅ Add Article
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
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (!res.ok) throw new Error("Failed to save article");

      setArticles([...articles, article]);
      setNewArticle({ title: "", content: "" });
      alert("✅ Article saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save article");
    }
  };

  // ✅ Edit Article
  const handleEdit = (article) => {
    setEditingArticle(article);
    setNewArticle({
      title: article.title,
      content: article.content,
    });
  };

  const handleUpdate = async () => {
    if (!editingArticle) return;

    const updatedArticle = {
      ...editingArticle,
      ...newArticle,
      slug: slugify(newArticle.title, { lower: true, strict: true }),
    };

    try {
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArticle),
      });

      if (!res.ok) throw new Error("Failed to update article");

      setArticles(
        articles.map((a) =>
          a.id === editingArticle.id ? updatedArticle : a
        )
      );
      setEditingArticle(null);
      setNewArticle({ title: "", content: "" });
      alert("✅ Article updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update article");
    }
  };

  // ✅ Delete Article
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete article");

      setArticles(articles.filter((a) => a.id !== id));
      alert("🗑️ Article deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete article");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Articles</h1>

      <div className="mb-4">
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
        {editingArticle ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Article
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Article
          </button>
        )}
      </div>

      <ul>
        {articles.map((article) => (
          <li key={article.id} className="border-b py-2 flex justify-between">
            <span>{article.title}</span>
            <div>
              <button
                onClick={() => handleEdit(article)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
