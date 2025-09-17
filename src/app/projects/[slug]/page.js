"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import projects from "../../../../data/projects.json";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

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
      <h1 className="text-3xl font-bold mb-2 text-blue-500">
        Project: {project.title}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(project.createdAt).toLocaleDateString()}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
        {project.content?.trim()
          ? project.content
          :project.description}
      </p>

      {/* 🔗 Show link if available */}
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
