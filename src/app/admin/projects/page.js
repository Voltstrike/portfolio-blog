"use client"
import { useState } from "react"

export default function AdminProjectsPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tech, setTech] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tech: tech.split(",").map((t) => t.trim())
      })
    })
    alert("Project saved!")
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder="Tech stack (comma separated)"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />
        <button type="submit" className="bg-indigo-600 px-6 py-2 rounded">
          Save
        </button>
      </form>
    </main>
  )
}
