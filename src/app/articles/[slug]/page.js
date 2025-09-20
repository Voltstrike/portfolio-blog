"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        const found = data.find(
          (a) =>
            a.slug === slug ||
            a.title.toLowerCase().replace(/\s+/g, "-") === slug
        );
        setArticle(found || null);
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!article) return <p className="text-red-500">❌ Article not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-4">
        {article.date ? new Date(article.date).toLocaleDateString() : ""}
      </p>
      <div className="text-gray-700 whitespace-pre-line">{article.content}</div>
    </div>
  );
}
