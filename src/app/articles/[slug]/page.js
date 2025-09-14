"use client";
import { useParams } from "next/navigation";
import articles from "../../../../data/articles.json";
import Link from "next/link";

export default function ArticleDetailPage() {
  const { slug } = useParams();

  // Find article by slug
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Article Not Found</h1>
        <Link href="/articles" className="text-blue-600 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        {article.title}
      </h1>
      <p className="text-gray-500 text-sm">
        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ""}
      </p>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        {article.content?.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Back link */}
      <div className="pt-6">
        <Link
          href="/articles"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          ← Back to Articles
        </Link>
      </div>
    </div>
  );
}
