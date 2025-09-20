"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  // ✅ Add handler
  const handleAdd = async () => {
    if (!newProject.title || !newProject.description) return;

    const slug = slugify(newProject.title, { lower: true, strict: true });
    const project = {
      id: Date.now(),
      slug,
      ...newProject,
      date: new Date().toISOString(),
    };

    try {
      // Call API route to commit to GitHub
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error("Failed to save project");

      // Update UI state only after commit succeeded
      setProjects([...projects, project]);
      setNewProject({ title: "", description: "", link: "" });
      alert("✅ Project saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save project");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage Projects</h1>

      <div className="my-4">
        <input
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Link"
          value={newProject.link}
          onChange={(e) =>
            setNewProject({ ...newProject, link: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      <ul>
        {projects.map((project) => (
          <li key={project.id} className="border-b py-2">
            {project.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
