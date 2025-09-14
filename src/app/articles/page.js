"use client";
import articles from "../../../data/articles.json";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArticlesPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          My Articles ✍️
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Thoughts, tutorials, and lessons learned along my coding and data journey.
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        {articles?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((a, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-t-4 border-gradient-to-r from-purple-500 to-pink-500"
              >
                <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {a.content?.length > 150
                    ? a.content.slice(0, 150) + "..."
                    : a.content}
                </p>
                <Link
                  href={`/articles/${a.slug}`}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Read More →
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No articles published yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
