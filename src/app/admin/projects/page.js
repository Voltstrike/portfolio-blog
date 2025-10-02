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
  const [editingProject, setEditingProject] = useState(null);

  // ✅ Load projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Add Project
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
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error("Failed to save project");

      setProjects([...projects, project]);
      setNewProject({ title: "", description: "", link: "" });
      alert("✅ Project saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save project");
    }
  };

  // ✅ Edit Project
  const handleEdit = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      link: project.link,
    });
  };

  const handleUpdate = async () => {
    if (!editingProject) return;

    const updatedProject = {
      ...editingProject,
      ...newProject,
      slug: slugify(newProject.title, { lower: true, strict: true }),
    };

    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });

      if (!res.ok) throw new Error("Failed to update project");

      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? updatedProject : p
        )
      );
      setEditingProject(null);
      setNewProject({ title: "", description: "", link: "" });
      alert("✅ Project updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update project");
    }
  };

  // ✅ Delete Project
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      setProjects(projects.filter((p) => p.id !== id));
      alert("🗑️ Project deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete project");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

      {/* Form Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingProject ? "✏️ Edit Project" : "➕ Add New Project"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Project Description"
            rows="3"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <input
            type="text"
            placeholder="Project Link (optional)"
            value={newProject.link}
            onChange={(e) =>
              setNewProject({ ...newProject, link: e.target.value })
            }
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={editingProject ? handleUpdate : handleAdd}
            className={`px-6 py-3 rounded text-white font-medium transition ${
              editingProject
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingProject ? "Update Project" : "Add Project"}
          </button>
        </div>
      </div>

      {/* Project List */}
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
          >
            <span className="font-medium">{project.title}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
