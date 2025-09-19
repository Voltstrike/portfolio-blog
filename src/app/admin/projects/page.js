"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

const REPO = "Voltstrike/portfolio-blog";
const BRANCH = "main";
const FILE_PATH = "data/projects.json";
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch from GitHub
  const fetchProjects = async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const data = await res.json();
    if (data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf8");
      setProjects(JSON.parse(decoded));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 Commit update to GitHub
  const commitUpdate = async (updatedProjects, action) => {
    setLoading(true);
    setMessage("");

    // Get latest SHA
    const res = await fetch(API_URL, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const fileData = await res.json();

    const commitRes = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${action} project`,
        content: Buffer.from(
          JSON.stringify(updatedProjects, null, 2)
        ).toString("base64"),
        sha: fileData.sha,
        branch: BRANCH,
      }),
    });

    if (commitRes.ok) {
      setProjects(updatedProjects);
      setMessage(`✅ Successfully ${action} project`);
    } else {
      const error = await commitRes.json();
      setMessage(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  // 🔹 Add
  const addProject = () => {
    const title = prompt("Enter project title:");
    const description = prompt("Enter project description:");
    const link = prompt("Enter project link (optional):");

    if (!title || !description) return;

    const newProject = {
      id: Date.now(),
      slug: slugify(title, { lower: true }),
      title,
      description,
      link,
      createdAt: new Date().toISOString(),
    };

    const updated = [...projects, newProject];
    commitUpdate(updated, "add");
  };

  // 🔹 Edit
  const editProject = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    const title = prompt("Edit title:", project.title);
    const description = prompt("Edit description:", project.description);
    const link = prompt("Edit link:", project.link);

    const updated = projects.map((p) =>
      p.id === id ? { ...p, title, description, link } : p
    );
    commitUpdate(updated, "edit");
  };

  // 🔹 Delete
  const deleteProject = (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    commitUpdate(updated, "delete");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Projects</h1>
      <button
        onClick={addProject}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        ➕ Add Project
      </button>
      {message && <p className="mb-4">{message}</p>}

      <ul className="space-y-4">
        {projects.map((p) => (
          <li
            key={p.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600">{p.createdAt}</p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  🔗 {p.link}
                </a>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editProject(p.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
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
