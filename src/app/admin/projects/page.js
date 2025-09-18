"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [editId, setEditId] = useState(null);

  // Load projects
useEffect(() => {
  const load = async () => {
    const res = await fetch(
      "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/projects.json",
      { cache: "no-store" }
    );
    const data = await res.json();
    setProjects(data);
  };
  load();
}, []);


  const saveToGitHub = async (file, updated) => {
    await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: `data/${file}`,
        content: JSON.stringify(updated, null, 2),
        message: `Update ${file} via Admin`,
      }),
    });
  };

  // Add or update project
  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;

    let updated;
    if (editId) {
      updated = projects.map((p) =>
        p.id === editId
          ? { ...p, title, description, link, slug: slugify(title) }
          : p
      );
      setEditId(null);
    } else {
      const newProject = {
        id: Date.now(),
        title,
        description,
        link,
        createdAt: new Date().toISOString(),
        slug: slugify(title),
      };
      updated = [...projects, newProject];
    }

    setProjects(updated);
    saveToGitHub("projects.json", updated);
    setTitle("");
    setDescription("");
    setLink("");
  };

  // Delete project
  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveToGitHub("projects.json", updated);
  };

  // Load project into form for editing
  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link || "");
    setEditId(project.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Projects</h1>

      {/* Form */}
      <div className="mb-6 space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Project Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editId ? "✏️ Update Project" : "➕ Add Project"}
        </button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {projects.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              <strong>{p.title}</strong> <span className="text-sm">({p.slug})</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
