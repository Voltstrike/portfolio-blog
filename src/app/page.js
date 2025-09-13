"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [about, setAbout] = useState({ bio: "" });
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);

  // Load about
  const loadAbout = () => {
    const saved = localStorage.getItem("about");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAbout({ bio: parsed.bio || "" });
      } catch {
        console.error("Invalid about.json, using defaults");
      }
    }
  };

  // Load projects
  const loadProjects = () => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch {
        console.error("Invalid projects.json, using defaults");
      }
    }
  };

  // Load articles
  const loadArticles = () => {
    const saved = localStorage.getItem("articles");
    if (saved) {
      try {
        setArticles(JSON.parse(saved));
      } catch {
        console.error("Invalid articles.json, using defaults");
      }
    }
  };

  // Run once + listen for updates
  useEffect(() => {
    loadAbout();
    loadProjects();
    loadArticles();

    const handleStorageChange = (e) => {
      if (e.key === "about") loadAbout();
      if (e.key === "projects") loadProjects();
      if (e.key === "articles") loadArticles();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Sort newest first
  const latestProjects = [...projects].reverse().slice(0, 3);
  const latestArticles = [...articles].reverse().slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-lg text-gray-700 mb-6">
          {about.bio?.trim()
            ? about.bio.length > 150
              ? about.bio.slice(0, 150) + "..."
              : about.bio
            : "Hi, I'm still working on my bio. Stay tuned!"}
        </p>
        <Link
          href="/about"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Read More About Me
        </Link>
      </div>

      {/* Latest Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Latest Projects</h2>
        {latestProjects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {latestProjects.map((p, i) => (
              <div key={i} className="p-4 border rounded-md bg-white shadow">
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-gray-700 mb-2">
                  {p.description?.length > 100
                    ? p.description.slice(0, 100) + "..."
                    : p.description}
                </p>
                <Link href="/projects" className="text-blue-500 hover:underline">
                  View More
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects added yet.</p>
        )}
      </section>

      {/* Latest Articles */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Articles</h2>
        {latestArticles.length > 0 ? (
          <ul className="space-y-3">
            {latestArticles.map((a, i) => (
              <li key={i} className="p-4 border rounded-md bg-white shadow">
                <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                <p className="text-gray-700 mb-2">
                  {a.content?.length > 120
                    ? a.content.slice(0, 120) + "..."
                    : a.content}
                </p>
                <Link href="/articles" className="text-blue-500 hover:underline">
                  Read More
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No articles published yet.</p>
        )}
      </section>
    </div>
  );
}
