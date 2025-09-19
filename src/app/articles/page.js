"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json"
        );
        if (!res.ok) throw new Error("Failed to load articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error loading articles:", err);
      }
      setLoading(false);
    };
    loadArticles();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles published yet.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a, i) => (
            <li
              key={i}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {a.createdAt
                  ? new Date(a.createdAt).toLocaleDateString()
                  : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {a.content?.length > 150
                  ? a.content.slice(0, 150) + "..."
                  : a.content}
              </p>
              <Link
                href={`/articles/${a.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read More →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
