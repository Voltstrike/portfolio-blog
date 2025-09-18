"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// 🔹 Helper to make slug from title
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json",
          { cache: "no-store" }
        );
        const data = await res.json();

        const found = data.find(
          (a) =>
            (a.slug && a.slug === slug) ||
            slugify(a.title) === slug
        );

        setArticle(found);
      } catch (err) {
        console.error("Failed to load article", err);
      }
    };
    loadData();
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Article Not Found
        </h1>
        <Link href="/articles" className="text-blue-500 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {article.date ? new Date(article.date).toLocaleDateString() : ""}
      </p>
      <div className="prose dark:prose-invert">
        <p>{article.content}</p>
      </div>
      <div className="mt-8">
        <Link href="/articles" className="text-blue-500 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    </div>
  );
}
