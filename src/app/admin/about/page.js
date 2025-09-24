"use client";
import { useState, useEffect } from "react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState({ name: "", role: "", bio: "", photo: "" });

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then(setAbout);
  }, []);

  const handleSave = async () => {
    await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    });
    alert("About page updated!");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit About Page</h1>
      <input
        type="text"
        value={about.name}
        onChange={(e) => setAbout({ ...about, name: e.target.value })}
        placeholder="Name"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={about.role}
        onChange={(e) => setAbout({ ...about, role: e.target.value })}
        placeholder="Role"
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        value={about.bio}
        onChange={(e) => setAbout({ ...about, bio: e.target.value })}
        placeholder="Biography"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={about.photo}
        onChange={(e) => setAbout({ ...about, photo: e.target.value })}
        placeholder="Photo URL"
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
