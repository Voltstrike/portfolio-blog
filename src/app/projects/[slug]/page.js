"use client";
import { useParams } from "next/navigation";
import projects from "../../../../data/projects.json";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Project Not Found</h1>
        <Link href="/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
        {project.title}
      </h1>
      <p className="text-gray-500 text-sm">
        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
      </p>

      {/* Description */}
      <div className="prose dark:prose-invert max-w-none">
        <p>{project.description}</p>
      </div>

      {/* Back link */}
      <div className="pt-6">
        <Link
          href="/projects"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
