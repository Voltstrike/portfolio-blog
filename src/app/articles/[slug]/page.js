"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        const data = await res.json();
        const found = data.find((a) => a.slug === slug);
        setArticle(found || null);
      } catch (err) {
        console.error("Failed to load article", err);
      }
    };
    loadArticle();
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-gray-500">Sorry, this article doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(article.date).toLocaleDateString()}
      </p>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {article.content}
      </p>
    </div>
  );
}
