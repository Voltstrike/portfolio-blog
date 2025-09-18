"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json",
        { cache: "no-store" }
      );
      const data = await res.json();
      setArticles(data);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <ul className="space-y-6">
        {articles.map((a) => {
          const slug = a.slug || slugify(a.title);
          return (
            <li key={a.id} className="p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {a.date ? new Date(a.date).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {a.content?.slice(0, 150)}...
              </p>
              <Link href={`/articles/${slug}`} className="text-blue-600 hover:underline">
                Read More →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
