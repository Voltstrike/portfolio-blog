"use client";
import { useEffect, useState } from "react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState({ bio: "", skills: [], journey: [] });

  useEffect(() => {
    fetch("/api/about").then((res) => res.json()).then(setAbout);
  }, []);

  const saveAbout = async () => {
    await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    });
    alert("About updated!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Manage About</h1>

      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={5}
        value={about.bio}
        onChange={(e) => setAbout({ ...about, bio: e.target.value })}
      />

      <button
        onClick={saveAbout}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save About
      </button>
    </div>
  );
}
