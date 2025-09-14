"use client";
import projects from "../../../data/projects.json";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          My Projects 🚀
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A collection of the things I’ve built — from coding projects to BI dashboards.
        </p>
      </section>

      {/* Projects Grid */}
      <section>
        {projects?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-t-4 border-gradient-to-r from-blue-500 to-purple-600"
              >
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {p.description?.length > 120
                    ? p.description.slice(0, 120) + "..."
                    : p.description}
                </p>
                <Link href={`/projects/${p.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  View Project →
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No projects added yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
