"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json",
        { cache: "no-store" }
      );
      const data = await res.json();
      setProjects(data);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => {
          const slug = p.slug || slugify(p.title);
          return (
            <div key={p.id} className="p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {p.description?.slice(0, 150)}...
              </p>
              <Link href={`/projects/${slug}`} className="text-blue-600 hover:underline">
                View Details →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
