"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// 🔹 Helper to make slug from title
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

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

        const found = data.find(
          (p) =>
            (p.slug && p.slug === slug) ||
            slugify(p.title) === slug
        );

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
      <h1 className="text-3xl font-bold mb-2">
        Project: {project.title}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {project.createdAt
          ? new Date(project.createdAt).toLocaleDateString()
          : ""}
      </p>
      <div className="prose dark:prose-invert mb-6">
        <p>{project.description || "Full description here..."}</p>
      </div>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
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
