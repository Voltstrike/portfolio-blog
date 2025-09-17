"use client";
import { useState, useEffect } from "react";
import projectsData from "../../../../data/projects.json";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", content: "", link: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Load existing projects
  useEffect(() => {
    setProjects(projectsData);
  }, []);

  // Save to localStorage (mock persistence for now)
  const saveProjects = async (newProjects) => {
  try {
    const res = await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: "data/projects.json", // relative to repo root
        content: JSON.stringify(newProjects, null, 2),
        message: "Update projects.json via Admin Panel",
      }),
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    alert("✅ Projects updated successfully on GitHub!");
  } catch (err) {
    alert("❌ Failed to save: " + err.message);
  }
};

  // Handle add or update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = {
        ...form,
        slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        createdAt: updated[editIndex].createdAt, // keep old date
      };
      saveProjects(updated);
      setEditIndex(null);
    } else {
      saveProjects([
        ...projects,
        {
          ...form,
          slug: form.title.toLowerCase().replace(/\s+/g, "-"),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setForm({ title: "", description: "", content: "", link: "" });
  };

  const handleEdit = (i) => {
    setForm(projects[i]);
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    const updated = projects.filter((_, idx) => idx !== i);
    saveProjects(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Full Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded"
          rows="5"
          required
        />
        <input
          type="text"
          placeholder="Project Link (GitHub, Colab, etc.)"
          value={form.link || ""}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editIndex !== null ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* Projects List */}
      <ul className="space-y-4">
        {projects.map((p, i) => (
          <li
            key={i}
            className="p-4 border rounded-lg bg-white dark:bg-gray-900 shadow flex flex-col"
          >
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{p.description}</p>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2"
              >
                🔗 Preview Link
              </a>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEdit(i)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
