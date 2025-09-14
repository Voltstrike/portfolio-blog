"use client";
import about from "../../../data/about.json";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Hero */}
      <section className="text-center">
        {/* Avatar with gradient border */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
              <img
                src="https://ui-avatars.com/api/?name=Mikail+Husada&background=4f46e5&color=fff&size=256"
                alt="Profile Picture"
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          About Me
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get to know who I am, my skills, and my journey so far 🚀
        </p>
      </section>

      {/* Bio */}
      <section className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 border-b-4 border-gradient-to-r from-blue-500 to-purple-600 inline-block pb-1">
          Bio
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {about.bio?.trim()
            ? about.bio
            : "I haven't written my bio yet. Stay tuned!"}
        </p>
      </section>

      {/* Skills */}
      <section className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 border-b-4 border-gradient-to-r from-purple-500 to-pink-500 inline-block pb-1">
          Skills
        </h2>
        {about.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {about.skills.map((s, i) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow"
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
      <section className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 border-b-4 border-gradient-to-r from-pink-500 to-orange-500 inline-block pb-1">
          My Journey
        </h2>
        {about.journey?.length > 0 ? (
          <ol className="relative border-l border-gray-300 dark:border-gray-600">
            {about.journey.map((j, i) => (
              <li key={i} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900"></span>
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
