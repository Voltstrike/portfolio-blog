"use client";
import { useEffect, useState } from "react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about", { cache: "no-store" });
      const data = await res.json();
      setAbout(data);
    };
    fetchAbout();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error("Failed to update about");
      setMsg("✅ About updated successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Error updating about");
    } finally {
      setLoading(false);
    }
  };

  if (!about) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Edit About</h1>

      {/* Name */}
      <label className="block mb-4">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          value={about.name}
          onChange={(e) => setAbout({ ...about, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </label>

      {/* Role */}
      <label className="block mb-4">
        <span className="font-semibold">Role</span>
        <input
          type="text"
          value={about.role}
          onChange={(e) => setAbout({ ...about, role: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </label>

      {/* Photo URL */}
      <label className="block mb-4">
        <span className="font-semibold">Photo URL</span>
        <input
          type="text"
          value={about.photo}
          onChange={(e) => setAbout({ ...about, photo: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </label>

      {/* Bio */}
      <label className="block mb-4">
        <span className="font-semibold">Bio</span>
        <textarea
          value={about.bio}
          onChange={(e) => setAbout({ ...about, bio: e.target.value })}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </label>

      {/* Skills */}
      <div className="mb-4">
        <span className="font-semibold">Skills</span>
        {about.skills?.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={s.name}
              onChange={(e) => {
                const skills = [...about.skills];
                skills[i].name = e.target.value;
                setAbout({ ...about, skills });
              }}
              className="flex-1 p-2 border rounded"
              placeholder="Skill Name"
            />
          </div>
        ))}
        <button
          onClick={() =>
            setAbout({ ...about, skills: [...about.skills, { name: "", level: "" }] })
          }
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Add Skill
        </button>
      </div>

      {/* Journey */}
      <div className="mb-4">
        <span className="font-semibold">Journey</span>
        {about.journey?.map((j, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={j.year}
              onChange={(e) => {
                const journey = [...about.journey];
                journey[i].year = e.target.value;
                setAbout({ ...about, journey });
              }}
              className="w-24 p-2 border rounded"
              placeholder="Year"
            />
            <input
              type="text"
              value={j.event}
              onChange={(e) => {
                const journey = [...about.journey];
                journey[i].event = e.target.value;
                setAbout({ ...about, journey });
              }}
              className="flex-1 p-2 border rounded"
              placeholder="Event"
            />
          </div>
        ))}
        <button
          onClick={() =>
            setAbout({ ...about, journey: [...about.journey, { year: "", event: "" }] })
          }
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Add Journey
        </button>
      </div>

      {/* Fun Fact */}
      <label className="block mb-4">
        <span className="font-semibold">Fun Fact</span>
        <input
          type="text"
          value={about.funFact}
          onChange={(e) => setAbout({ ...about, funFact: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
