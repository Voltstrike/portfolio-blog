"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";

const REPO = "Voltstrike/portfolio-blog";
const BRANCH = "main";
const FILE_PATH = "data/articles.json";
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch from GitHub
  const fetchArticles = async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const data = await res.json();
    if (data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf8");
      setArticles(JSON.parse(decoded));
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 🔹 Commit update to GitHub
  const commitUpdate = async (updatedArticles, action) => {
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
        message: `${action} article`,
        content: Buffer.from(
          JSON.stringify(updatedArticles, null, 2)
        ).toString("base64"),
        sha: fileData.sha,
        branch: BRANCH,
      }),
    });

    if (commitRes.ok) {
      setArticles(updatedArticles);
      setMessage(`✅ Successfully ${action} article`);
    } else {
      const error = await commitRes.json();
      setMessage(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  // 🔹 Add
  const addArticle = () => {
    const title = prompt("Enter title:");
    const content = prompt("Enter content:");
    if (!title || !content) return;

    const newArticle = {
      id: Date.now(),
      slug: slugify(title, { lower: true }),
      title,
      content,
      date: new Date().toISOString(),
    };

    const updated = [...articles, newArticle];
    commitUpdate(updated, "add");
  };

  // 🔹 Edit
  const editArticle = (id) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    const title = prompt("Edit title:", article.title);
    const content = prompt("Edit content:", article.content);

    const updated = articles.map((a) =>
      a.id === id ? { ...a, title, content } : a
    );
    commitUpdate(updated, "edit");
  };

  // 🔹 Delete
  const deleteArticle = (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const updated = articles.filter((a) => a.id !== id);
    commitUpdate(updated, "delete");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Articles</h1>
      <button
        onClick={addArticle}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        ➕ Add Article
      </button>
      {message && <p className="mb-4">{message}</p>}

      <ul className="space-y-4">
        {articles.map((a) => (
          <li
            key={a.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{a.title}</h2>
              <p className="text-sm text-gray-600">{a.date}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editArticle(a.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteArticle(a.id)}
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
