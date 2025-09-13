"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import articles from "../../../data/articles.json"; 

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Load articles initially
    const stored = localStorage.getItem("articles");
    if (stored) setArticles(JSON.parse(stored));

    // ✅ Listen for changes
    const sync = () => {
      const updated = localStorage.getItem("articles");
      setArticles(updated ? JSON.parse(updated) : []);
    };
    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      {articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((a, i) => (
            <li key={i} className="p-4 border rounded-md bg-white shadow">
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p className="text-gray-500 text-sm mb-2">
                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 mb-2">
                {a.content?.length > 150
                  ? a.content.slice(0, 150) + "..."
                  : a.content}
              </p>
              <Link
                href={`/articles/${i}`}
                className="text-blue-500 hover:underline"
              >
                Read More
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No articles published yet.</p>
      )}
    </div>
  );
}
