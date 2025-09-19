"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json"
        );
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
      setLoading(false);
    };
    loadProjects();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString()
                  : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {p.description?.length > 120
                  ? p.description.slice(0, 120) + "..."
                  : p.description}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Preview 🔗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
