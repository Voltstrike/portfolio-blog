"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [about, setAbout] = useState({ bio: "" });
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);

  // Load JSON files from /data
  useEffect(() => {
    const loadData = async () => {
      try {
        const aboutRes = await fetch("/about.json");
        const aboutData = await aboutRes.json();
        setAbout(aboutData);

        const projectsRes = await fetch("/projects.json");
        const projectsData = await projectsRes.json();
        setProjects(projectsData);

        const articlesRes = await fetch("/articles.json");
        const articlesData = await articlesRes.json();
        setArticles(articlesData);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    };

    loadData();
  }, []);

  // Sort newest first
  const latestProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio 👋</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {about.bio?.trim()
            ? about.bio.length > 180
              ? about.bio.slice(0, 180) + "..."
              : about.bio
            : "Hi, I'm still working on my bio. Stay tuned!"}
        </p>
        <Link
          href="/about"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Read More About Me
        </Link>
      </section>

      {/* Latest Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Latest Projects</h2>
        {latestProjects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestProjects.map((p, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-gray-900 shadow rounded-2xl"
              >
                <h3 className="text-lg font-bold mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {p.description?.length > 100
                    ? p.description.slice(0, 100) + "..."
                    : p.description}
                </p>
                <Link
                  href="/projects"
                  className="text-blue-500 hover:underline"
                >
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
          <ul className="space-y-4">
            {latestArticles.map((a, i) => (
              <li
                key={i}
                className="p-4 bg-white dark:bg-gray-900 shadow rounded-2xl"
              >
                <h3 className="text-lg font-bold mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {a.content?.length > 120
                    ? a.content.slice(0, 120) + "..."
                    : a.content}
                </p>
                <Link
                  href={`/articles/${a.slug}`}
                  className="text-blue-500 hover:underline"
                >
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
