// app/admin/page.js
"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminPage() {
  const sections = [
    { name: "About Me", description: "Edit your bio and skills.", link: "/admin/about" },
    { name: "Projects", description: "Add, edit, delete portfolio projects.", link: "/admin/projects" },
    { name: "Articles", description: "Write and manage blog posts.", link: "/admin/articles" },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 text-gray-200 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-400 text-lg">Manage your portfolio content.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-gray-800 dark:bg-gray-900 p-8 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{section.name}</h2>
            <p className="text-gray-400 mb-4">{section.description}</p>

            <Link
              href={section.link}
              className="inline-block bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Manage →
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
