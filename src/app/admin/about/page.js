"use client";
import { useState, useEffect } from "react";

export default function AdminAboutPage() {
  // ✅ Default safe structure
  const [about, setAbout] = useState({
    bio: "",
    skills: [],
    journey: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newJourney, setNewJourney] = useState({ year: "", text: "" });

  // ✅ Load from localStorage (or keep defaults if empty)
  useEffect(() => {
    const saved = localStorage.getItem("about");
    if (saved) {
      try {
        setAbout({ bio: "", skills: [], journey: [], ...JSON.parse(saved) });
      } catch {
        console.error("Invalid about.json, using defaults");
      }
    }
  }, []);

  // ✅ Save whenever `about` changes
  useEffect(() => {
    localStorage.setItem("about", JSON.stringify(about));
  }, [about]);

  // Handlers
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setAbout({ ...about, skills: [...about.skills, newSkill] });
    setNewSkill("");
  };

  const removeSkill = (i) => {
    setAbout({ ...about, skills: about.skills.filter((_, idx) => idx !== i) });
  };

  const addJourney = () => {
    if (!newJourney.year.trim() || !newJourney.text.trim()) return;
    setAbout({ ...about, journey: [...about.journey, newJourney] });
    setNewJourney({ year: "", text: "" });
  };

  const removeJourney = (i) => {
    setAbout({ ...about, journey: about.journey.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — About Me</h1>

      {/* Bio Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Bio</h2>
        <textarea
          value={about.bio}
          onChange={(e) => setAbout({ ...about, bio: e.target.value })}
          className="w-full p-2 border rounded-md text-black"
          rows={4}
        />
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="mb-2 space-y-1">
          {about.skills?.map((s, i) => (
            <li key={i} className="flex items-center justify-between">
              {s}
              <button
                onClick={() => removeSkill(i)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="p-2 border rounded-md flex-1 text-black"
          />
          <button onClick={addSkill} className="bg-blue-500 text-white px-3 py-2 rounded-md">
            Add
          </button>
        </div>
      </div>

      {/* Journey Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Journey</h2>
        <ul className="mb-2 space-y-2">
          {about.journey?.map((j, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>
                <strong>{j.year}</strong> — {j.text}
              </span>
              <button
                onClick={() => removeJourney(i)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mb-2">
          <input
            value={newJourney.year}
            onChange={(e) => setNewJourney({ ...newJourney, year: e.target.value })}
            placeholder="Year"
            className="p-2 border rounded-md w-20 text-black"
          />
          <input
            value={newJourney.text}
            onChange={(e) => setNewJourney({ ...newJourney, text: e.target.value })}
            placeholder="What happened?"
            className="p-2 border rounded-md flex-1 text-black"
          />
          <button onClick={addJourney} className="bg-blue-500 text-white px-3 py-2 rounded-md">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
