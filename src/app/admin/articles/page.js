"use client"
import { useState, useEffect } from "react"

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/articles")
      const data = await res.json()
      setArticles(data)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    })
    alert("Article added!")
    setTitle("")
    setContent("")

    // reload
    const res = await fetch("/api/articles")
    const data = await res.json()
    setArticles(data)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <input
          type="text"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <textarea
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          rows={6}
        />
        <button type="submit" className="bg-indigo-600 px-6 py-2 rounded">
          Publish
        </button>
      </form>

      {/* Article List */}
      <h2 className="text-2xl font-semibold mb-4">Existing Articles</h2>
      <ul className="space-y-4">
        {articles.map((a) => (
          <li key={a.id} className="p-4 border rounded bg-gray-900">
            <h3 className="font-semibold text-lg">{a.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(a.date).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-300 line-clamp-2">{a.content}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
