"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/data/projects.json");
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

  const addProject = () => {
    if (!title.trim() || !description.trim()) return;
    const newProject = {
      id: Date.now(),
      title,
      description,
      link,
      createdAt: new Date().toISOString(),
      slug: slugify(title), // ✅ generate slug
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    saveToGitHub("projects.json", updated);
    setTitle("");
    setDescription("");
    setLink("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Projects</h1>

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
          onClick={addProject}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          ➕ Add Project
        </button>
      </div>

      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="p-4 bg-gray-100 rounded">
            <strong>{p.title}</strong> ({p.slug})
          </li>
        ))}
      </ul>
    </div>
  );
}
