"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json"
        );
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        const found = data.find((a) => a.slug === slug);
        setArticle(found || null);
      } catch (err) {
        console.error("Error loading article:", err);
      }
      setLoading(false);
    };
    loadArticle();
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!article)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Article not found</h1>
        <Link href="/articles" className="text-blue-600 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-6">
        {article.createdAt
          ? new Date(article.createdAt).toLocaleDateString()
          : ""}
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {article.content}
      </p>
    </div>
  );
}
