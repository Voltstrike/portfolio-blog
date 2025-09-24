"use client";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [about, setAbout] = useState({ bio: "", skills: [], journey: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Voltstrike/portfolio-blog/main/data/about.json",
          { cache: "no-store" } // always fetch fresh
        );
        const data = await res.json();
        setAbout(data);
      } catch (err) {
        console.error("Failed to load about.json", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bio</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {about.bio || "Still working on my bio..."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        {about.skills?.length ? (
          <ul className="list-disc pl-5">
            {about.skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No skills added yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">My Journey</h2>
        {about.journey?.length ? (
          <ul className="space-y-2">
            {about.journey.map((j, i) => (
              <li key={i}>
                <span className="font-bold">{j.year}</span> — {j.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No journey added yet.</p>
        )}
      </section>
    </div>
  );
}
