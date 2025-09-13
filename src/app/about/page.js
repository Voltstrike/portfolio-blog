"use client";
import about from "../../../data/about.json"; // adjust path if needed

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      {/* Bio */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bio</h2>
        <p className="text-gray-700">
          {about.bio?.trim()
            ? about.bio
            : "I haven't written my bio yet. Stay tuned!"}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        {about.skills?.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {about.skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No skills added yet.</p>
        )}
      </section>

      {/* Journey */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">My Journey</h2>
        {about.journey?.length > 0 ? (
          <ul className="space-y-2">
            {about.journey.map((j, i) => (
              <li key={i} className="text-gray-700">
                <span className="font-bold">{j.year}</span> —{" "}
                {j.description || j.text}
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
