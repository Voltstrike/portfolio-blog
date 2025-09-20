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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Projects</h1>

      <div className="mb-4">
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
        {editingProject ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Project
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Project
          </button>
        )}
      </div>

      <ul>
        {projects.map((project) => (
          <li key={project.id} className="border-b py-2 flex justify-between">
            <span>{project.title}</span>
            <div>
              <button
                onClick={() => handleEdit(project)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
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
