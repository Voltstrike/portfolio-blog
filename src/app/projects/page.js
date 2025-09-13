"use client";
import { useState, useEffect } from "react";
import projects from "../../../data/projects.json"; 

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects initially
    const stored = localStorage.getItem("projects");
    if (stored) setProjects(JSON.parse(stored));

    // ✅ Listen for changes
    const sync = () => {
      const updated = localStorage.getItem("projects");
      setProjects(updated ? JSON.parse(updated) : []);
    };
    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="p-4 border rounded-md bg-white shadow">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-500 text-sm mb-2">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
              </p>
              <p className="text-gray-700">{p.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No projects added yet.</p>
      )}
    </div>
  );
}
