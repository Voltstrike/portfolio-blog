"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json"
        );
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        const found = data.find((p) => p.slug === slug);
        setProject(found || null);
      } catch (err) {
        console.error("Error loading project:", err);
      }
      setLoading(false);
    };
    loadProject();
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!project)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Project not found</h1>
        <Link href="/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-500 mb-6">
        {project.createdAt
          ? new Date(project.createdAt).toLocaleDateString()
          : ""}
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {project.description}
      </p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔗 View Project
        </a>
      )}
    </div>
  );
}
