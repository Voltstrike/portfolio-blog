// app/contact/page.js
"use client"
import { motion } from "framer-motion"
import { Mail, Linkedin } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-gray-200 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
        <p className="text-gray-400 dark:text-gray-400 text-lg">
          I’d love to connect! You can reach me through email or LinkedIn.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-6">
        {/* Email */}
        <a
          href="mailto:mikailhusada@gmail.com"
          className="flex items-center gap-3 bg-gray-800 dark:bg-gray-900 px-6 py-3 rounded-xl shadow hover:shadow-lg transition"
        >
          <Mail className="w-6 h-6 text-indigo-400" />
          <span className="text-lg font-medium">mikailhusada@gmail.com</span>
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/mikail-crito-husada"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-gray-800 dark:bg-gray-900 px-6 py-3 rounded-xl shadow hover:shadow-lg transition"
        >
          <Linkedin className="w-6 h-6 text-indigo-400" />
          <span className="text-lg font-medium">linkedin.com/in/mikail-crito-husada</span>
        </a>
      </div>
    </main>
  )
}
