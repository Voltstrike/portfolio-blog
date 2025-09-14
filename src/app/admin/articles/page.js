"use client";
import { useEffect, useState } from "react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ slug: "", title: "", content: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("/api/articles").then((res) => res.json()).then(setArticles);
  }, []);

  const addArticle = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newArticle = await res.json();
    setArticles([...articles, newArticle]);
    setForm({ slug: "", title: "", content: "" });
  };

  const updateArticle = async () => {
    const res = await fetch("/api/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setArticles(articles.map((a) => (a.slug === updated.slug ? updated : a)));
    setEditing(null);
    setForm({ slug: "", title: "", content: "" });
  };

  const deleteArticle = async (slug) => {
    await fetch("/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setArticles(articles.filter((a) => a.slug !== slug));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={(e) => {
          editing ? (e.preventDefault(), updateArticle()) : addArticle(e);
        }}
        className="space-y-3"
      >
        <input
          placeholder="Slug"
          className="w-full border p-2 rounded"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          disabled={!!editing}
          required
        />
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Article" : "Add Article"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ slug: "", title: "", content: "" });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List Articles */}
      <ul className="space-y-3">
        {articles.map((a) => (
          <li
            key={a.slug}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{a.title}</span>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(a.slug);
                  setForm(a);
                }}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteArticle(a.slug)}
                className="text-red-500 hover:underline"
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
