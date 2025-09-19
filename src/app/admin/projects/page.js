"use client";
import { useEffect, useState } from "react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/projects.json");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    load();
  }, []);

  const saveProjects = async (updated) => {
    setProjects(updated);
    await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/projects.json",
        content: JSON.stringify(updated, null, 2),
        message: "Update projects.json",
      }),
    });
  };

  const addProject = async () => {
    if (!title.trim() || !description.trim()) return;
    const newProject = {
      id: Date.now(),
      title,
      description,
      link,
      createdAt: new Date().toISOString(),
    };
    const updated = [...projects, newProject];
    await saveProjects(updated);
    setTitle("");
    setDescription("");
    setLink("");
  };

  const deleteProject = async (id) => {
    const updated = projects.filter((p) => p.id !== id);
    await saveProjects(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Projects</h1>

      {/* Add New */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Project Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          onClick={addProject}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="border p-4 rounded">
            <h3 className="font-bold">{p.title}</h3>
            <textarea
              className="w-full border mt-2 p-2"
              value={p.description}
              onChange={(e) =>
                saveProjects(
                  projects.map((x) =>
                    x.id === p.id ? { ...x, description: e.target.value } : x
                  )
                )
              }
            />
            <p className="text-sm text-blue-500 mt-1">{p.link}</p>
            <button
              onClick={() => deleteProject(p.id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
