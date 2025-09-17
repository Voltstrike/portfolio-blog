"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json",
          { cache: "no-store" }
        );
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles.json", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      {articles.length > 0 ? (
        <ul className="space-y-6">
          {articles.map((a, i) => (
            <li
              key={i}
              className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl"
            >
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {a.content?.slice(0, 150)}...
              </p>
              <Link
                href={`/articles/${a.slug}`}
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
