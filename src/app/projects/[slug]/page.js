"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json",
          { cache: "no-store" }
        );
        const data = await res.json();
        const found = data.find((p) => p.slug === slug);
        setProject(found);
      } catch (err) {
        console.error("Failed to load project", err);
      }
    };
    loadData();
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-blue-500">{project.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(project.createdAt).toLocaleDateString()}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
        {project.content || project.description}
      </p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔗 View Project
        </a>
      )}

      <div className="mt-8">
        <Link href="/projects" className="text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
