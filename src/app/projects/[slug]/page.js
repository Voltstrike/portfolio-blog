"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.find(
          (p) =>
            p.slug === slug ||
            p.title.toLowerCase().replace(/\s+/g, "-") === slug
        );
        setProject(found || null);
      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!project) return <p className="text-red-500">❌ Project not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-500 mb-4">
        {project.date ? new Date(project.date).toLocaleDateString() : ""}
      </p>
      <div className="text-gray-700 whitespace-pre-line mb-6">
        {project.description}
      </div>
      {project.link && (
        <Link
          href={project.link}
          target="_blank"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          🔗 View Project
        </Link>
      )}
    </div>
  );
}
