"use client";
import { useEffect, useState } from "react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ slug: "", title: "", description: "" });
  const [editing, setEditing] = useState(null); // slug of project being edited

  useEffect(() => {
    fetch("/api/projects").then((res) => res.json()).then(setProjects);
  }, []);

  const addProject = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newProject = await res.json();
    setProjects([...projects, newProject]);
    setForm({ slug: "", title: "", description: "" });
  };

  const updateProject = async () => {
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setProjects(projects.map((p) => (p.slug === updated.slug ? updated : p)));
    setEditing(null);
    setForm({ slug: "", title: "", description: "" });
  };

  const deleteProject = async (slug) => {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setProjects(projects.filter((p) => p.slug !== slug));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={(e) => {
          editing ? (e.preventDefault(), updateProject()) : addProject(e);
        }}
        className="space-y-3"
      >
        <input
          placeholder="Slug"
          className="w-full border p-2 rounded"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          disabled={!!editing} // prevent editing slug
          required
        />
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Project" : "Add Project"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ slug: "", title: "", description: "" });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List Projects */}
      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.slug}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{p.title}</span>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(p.slug);
                  setForm(p);
                }}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p.slug)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
