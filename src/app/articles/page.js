"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles", err);
      }
    };
    loadArticles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      {articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-1">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(a.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {a.content.length > 150
                  ? a.content.slice(0, 150) + "..."
                  : a.content}
              </p>
              <Link
                href={`/articles/${a.slug}`}
                className="text-blue-500 hover:underline"
              >
                Read More →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available.</p>
      )}
    </div>
  );
}
