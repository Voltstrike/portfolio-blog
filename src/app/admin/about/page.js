"use client";
import { useEffect, useState } from "react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState({ bio: "", skills: [], journey: [] });

  useEffect(() => {
    fetch("/api/about").then((res) => res.json()).then(setAbout);
  }, []);

  const saveAbout = async (newAbout) => {
  try {
    const res = await fetch("/api/github/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: "data/about.json",
        content: JSON.stringify(newAbout, null, 2),
        message: "Update about.json via Admin Panel",
      }),
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    alert("✅ About page updated successfully!");
  } catch (err) {
    alert("❌ Failed to save: " + err.message);
  }
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
