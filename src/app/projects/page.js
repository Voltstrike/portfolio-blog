"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white dark:bg-gray-900 shadow rounded-xl"
            >
              <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {p.description.length > 100
                  ? p.description.slice(0, 100) + "..."
                  : p.description}
              </p>
              <Link
                href={`/projects/${p.slug}`}
                className="text-blue-500 hover:underline"
              >
                View Project →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}
