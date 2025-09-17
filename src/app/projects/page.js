"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json",
          { cache: "no-store" }
        );
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects.json", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {p.description?.slice(0, 100)}...
              </p>
              <div className="flex gap-3">
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    🔗 Live Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No projects added yet.</p>
      )}
    </div>
  );
}
