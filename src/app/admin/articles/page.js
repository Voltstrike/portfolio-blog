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

  // 🔹 Fetch articles from GitHub JSON
  const fetchArticles = async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const data = await res.json();
    if (data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf8");
      setArticles(JSON.parse(decoded));
    } else {
      console.error("❌ Failed to load articles:", data);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Articles</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={() => alert("Add flow here")}
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
          </li>
        ))}
      </ul>
    </div>
  );
}
