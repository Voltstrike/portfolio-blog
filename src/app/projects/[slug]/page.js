"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import projects from "../../../../data/projects.json";

export default function ProjectDetailPage() {
  const { slug } = useParams();

  // find project by slug
  const project = projects.find(
    (p) =>
      p.title.toLowerCase().replace(/\s+/g, "-") ===
      decodeURIComponent(slug).toLowerCase()
  );

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Project Not Found
        </h1>
        <Link href="/projects" className="text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        {project.title}
      </h1>
      <p className="text-gray-500 mb-4">
        {project.createdAt
          ? new Date(project.createdAt).toLocaleDateString()
          : ""}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {project.description}
      </p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          🔗 View Project
        </a>
      )}

      <div className="mt-6">
        <Link href="/projects" className="text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
