"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch about");
        const data = await res.json();
        setAbout(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAbout();
  }, []);

  if (!about) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <Image
          src={about.photo || "/placeholder.jpg"}
          alt={about.name}
          width={160}
          height={160}
          className="rounded-full shadow-md mb-4 md:mb-0 md:mr-6"
        />
        <div>
          <h1 className="text-3xl font-bold">{about.name}</h1>
          <h2 className="text-lg text-blue-500 mb-4">{about.role}</h2>
          <p className="text-gray-700 dark:text-gray-300">{about.bio}</p>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Skills</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {about.skills?.map((s, i) => (
            <li
              key={i}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg shadow text-center"
            >
              <span className="font-semibold">{s.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Journey */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Journey</h2>
        <ul className="border-l-2 border-blue-500 pl-4 space-y-3">
          {about.journey?.map((j, i) => (
            <li key={i}>
              <span className="font-bold text-blue-600">{j.year}</span> — {j.event}
            </li>
          ))}
        </ul>
      </section>

      {/* Fun Fact */}
      {about.funFact && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Fun Fact</h2>
          <p className="italic text-gray-600 dark:text-gray-400">{about.funFact}</p>
        </section>
      )}
    </div>
  );
}
