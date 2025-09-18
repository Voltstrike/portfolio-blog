"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/articles.json",
        { cache: "no-store" }
      );
      const data = await res.json();
      const found = data.find(
        (a) => (a.slug && a.slug === slug) || slugify(a.title) === slug
      );
      setArticle(found);
    };
    loadData();
  }, [slug]);

  if (!article) {
    return <div className="max-w-3xl mx-auto p-6">❌ Article not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {article.date ? new Date(article.date).toLocaleDateString() : ""}
      </p>
      <p className="text-gray-700 dark:text-gray-300">{article.content}</p>
      <div className="mt-6">
        <Link href="/articles" className="text-blue-600 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    </div>
  );
}
