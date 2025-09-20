"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        const found = data.find((p) => p.slug === slug);
        setProject(found || null);
      } catch (err) {
        console.error("Failed to load project", err);
      }
    };
    loadProject();
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="text-gray-500">Sorry, this project doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(project.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
        {project.description}
      </p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔗 Visit Project
        </a>
      )}
    </div>
  );
}
