"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <html lang="en">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
        {/* Navbar */}
        <motion.header
          className="bg-gray-100 dark:bg-gray-950 shadow-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <nav className="container mx-auto flex justify-between items-center py-4 px-6">
            <h1 className="text-xl font-bold">MyPortfolio</h1>
            <ul className="flex space-x-6">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/articles">Articles</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
            <button
              onClick={toggleTheme}
              className="ml-6 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 transition"
            >
              {dark ? "🌙 Dark" : "🌞 Light" }
            </button>
          </nav>
        </motion.header>

        {/* Page Transition Wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname} // key forces animation on route change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex-grow container mx-auto px-6 py-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="bg-gray-100 dark:bg-gray-950 py-8 mt-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-gray-600 dark:text-gray-400">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} MyPortfolio. Built with Next.js & Tailwind CSS.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/in/mikail-crito-husada/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                LinkedIn
              </a>
              <a
                href="mailto:mikailhusada@gmail.com"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Email
              </a>
              <a
                href="https://github.com/voltstrike"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}
