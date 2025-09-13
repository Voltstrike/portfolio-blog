"use client";
import about from "../../../data/about.json"; // adjust path if needed

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Hi, I'm Mikail 👋</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Data Analyst & Web Developer — turning data into insights and building
          clean, user-friendly apps.
        </p>
      </section>

      {/* Bio */}
      <section className="mb-12 bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {about.bio?.trim()
            ? about.bio
            : "I haven't written my bio yet. Stay tuned!"}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-12 bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        {about.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {about.skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills added yet.</p>
        )}
      </section>

      {/* Journey */}
      <section className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6">My Journey</h2>
        {about.journey?.length > 0 ? (
          <ol className="relative border-l border-gray-300 dark:border-gray-600">
            {about.journey.map((j, i) => (
              <li key={i} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900"></span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {j.year}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {j.description || j.text}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No journey added yet.</p>
        )}
      </section>
    </div>
  );
}
