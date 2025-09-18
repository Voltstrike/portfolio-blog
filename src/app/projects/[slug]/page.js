"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json",
        { cache: "no-store" }
      );
      const data = await res.json();
      const found = data.find(
        (p) => (p.slug && p.slug === slug) || slugify(p.title) === slug
      );
      setProject(found);
    };
    loadData();
  }, [slug]);

  if (!project) {
    return <div className="max-w-3xl mx-auto p-6">❌ Project not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{project.description}</p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          🔗 Visit Project
        </a>
      )}

      <div className="mt-6">
        <Link href="/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
