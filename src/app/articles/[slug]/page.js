"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import articles from "../../../../data/articles.json";

export default function ArticleDetailPage() {
  const { slug } = useParams();

  // find article by slug
  const article = articles.find(
    (a) =>
      a.title.toLowerCase().replace(/\s+/g, "-") ===
      decodeURIComponent(slug).toLowerCase()
  );

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
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        {article.title}
      </h1>
      <p className="text-gray-500 mb-4">
        {article.date ? new Date(article.date).toLocaleDateString() : ""}
      </p>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {article.content}
      </p>

      <div className="mt-6">
        <Link href="/articles" className="text-blue-500 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    </div>
  );
}
