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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Load projects from GitHub
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json"
        );
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };
    loadProjects();
  }, []);

  // 🔹 Add Project
  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    setLoading(true);
    setMessage("");

    const slug = slugify(newProject.title, { lower: true, strict: true });
    const updated = [
      ...projects,
      {
        ...newProject,
        slug,
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      const res = await fetch("/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/projects.json",
          content: JSON.stringify(updated, null, 2),
          message: `Add project: ${newProject.title}`,
        }),
      });

      if (res.ok) {
        setProjects(updated);
        setNewProject({ title: "", description: "", link: "" });
        setMessage("✅ Project committed successfully!");
      } else {
        const result = await res.json();
        console.error("Commit failed:", result);
        setMessage("❌ Commit failed. Check console.");
      }
    } catch (err) {
      console.error("Error adding project:", err);
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin: Projects</h1>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      {/* Add Form */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="w-full border p-2 rounded"
          rows="3"
        />
        <input
          type="url"
          placeholder="Project Link"
          value={newProject.link}
          onChange={(e) =>
            setNewProject({ ...newProject, link: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <button
          onClick={addProject}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Project"}
        </button>
      </div>

      {/* Project List */}
      <ul className="space-y-3">
        {projects.map((p, i) => (
          <li
            key={i}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded shadow"
          >
            <strong>{p.title}</strong>
            <p className="text-sm text-gray-500">
              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
