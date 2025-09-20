"use client";
import { useEffect, useState } from "react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  async function loadProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAdd = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, link }),
    });

    if (res.ok) {
      alert("✅ Project added and saved to GitHub!");
      await loadProjects();
      setTitle("");
      setDescription("");
      setLink("");
    }
  };

  const handleUpdate = async (project) => {
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) await loadProjects();
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await loadProjects();
  };

  return (
    <div>
      <h1>Admin – Projects</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Project Link" />
      <button onClick={handleAdd}>Add Project</button>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <input
              value={p.title}
              onChange={(e) => handleUpdate({ ...p, title: e.target.value })}
            />
            <textarea
              value={p.description}
              onChange={(e) => handleUpdate({ ...p, description: e.target.value })}
            />
            <input
              value={p.link}
              onChange={(e) => handleUpdate({ ...p, link: e.target.value })}
            />
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
