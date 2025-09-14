"use client";
import Link from "next/link";
import { motion } from "framer-motion";

// Import JSON directly
import about from "../../data/about.json";
import projects from "../../data/projects.json";
import articles from "../../data/articles.json";

export default function HomePage() {
  const latestProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-6"
        >
          Welcome to My Portfolio 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-2xl mx-auto mb-8"
        >
          {about.bio?.trim()
            ? about.bio.length > 160
              ? about.bio.slice(0, 160) + "..."
              : about.bio
            : "Hi, I'm still working on my bio. Stay tuned!"}
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Read More About Me
          </Link>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* Latest Projects */}
<section>
  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
    🚀 Latest Projects
  </h2>
  {latestProjects.length > 0 ? (
    <div className="grid md:grid-cols-3 gap-8">
      {latestProjects.map((p, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.03 }}
          className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-t-4 border-blue-500"
        >
          <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {p.createdAt
              ? new Date(p.createdAt).toLocaleDateString()
              : ""}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {p.description?.length > 100
              ? p.description.slice(0, 100) + "..."
              : p.description}
          </p>
          <Link
            href="/projects"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View More →
          </Link>
        </motion.div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No projects added yet.</p>
  )}
</section>

{/* Latest Articles */}
<section>
  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
    ✍️ Latest Articles
  </h2>
  {latestArticles.length > 0 ? (
    <div className="grid md:grid-cols-2 gap-8">
      {latestArticles.map((a, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-t-4 border-purple-500"
        >
          <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {a.createdAt
              ? new Date(a.createdAt).toLocaleDateString()
              : ""}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {a.content?.length > 120
              ? a.content.slice(0, 120) + "..."
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
    <p className="text-gray-500">No articles published yet.</p>
  )}
</section>

      </div>
    </div>
  );
}
