"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Load initially
    const stored = localStorage.getItem("articles");
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = parsed.find((a) => a.slug === slug);
      setArticle(found || null);
    }

    // ✅ Listen for updates
    const sync = () => {
      const updated = localStorage.getItem("articles");
      if (updated) {
        const parsed = JSON.parse(updated);
        const found = parsed.find((a) => a.slug === slug);
        setArticle(found || null);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <p className="text-gray-500">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {article.createdAt
          ? new Date(article.createdAt).toLocaleDateString()
          : ""}
      </p>
      <div className="prose max-w-none whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
