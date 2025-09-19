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
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const commitChanges = async (updated, msg) => {
    try {
      const res = await fetch("/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/projects.json",
          content: JSON.stringify(updated, null, 2),
          message: msg,
        }),
      });

      if (res.ok) {
        setProjects(updated);
        setMessage("✅ Saved successfully!");
      } else {
        const result = await res.json();
        console.error("Commit failed:", result);
        setMessage("❌ Commit failed. Check console.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    setLoading(true);
    setMessage("");

    const slug = slugify(newProject.title, { lower: true, strict: true });
    const updated = [
      ...projects,
      { ...newProject, slug, createdAt: new Date().toISOString() },
    ];

    await commitChanges(updated, `Add project: ${newProject.title}`);
    setNewProject({ title: "", description: "", link: "" });
    setLoading(false);
  };

  const saveEdit = async (index) => {
    const updated = [...projects];
    updated[index].slug = slugify(updated[index].title, {
      lower: true,
      strict: true,
    });
    await commitChanges(updated, `Update project: ${updated[index].title}`);
    setEditingIndex(null);
  };

  const deleteProject = async (index) => {
    const updated = projects.filter((_, i) => i !== index);
    await commitChanges(updated, "Delete project");
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
            {editingIndex === i ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[i].title = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  value={p.description}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[i].description = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
                <input
                  type="url"
                  value={p.link}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[i].link = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={() => saveEdit(i)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <strong>{p.title}</strong>
                <p className="text-sm text-gray-500">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => setEditingIndex(i)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(i)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
