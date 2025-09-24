import Image from "next/image";

async function getAbout() {
  const res = await fetch("/api/about", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function AboutPage() {
  const about = await getAbout();

  if (!about) {
    return <div className="text-center py-20">About page data not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-center">
      <Image
        src={about.photo || "https://via.placeholder.com/160"}
        alt={about.name || "Placeholder"}
        width={160}
        height={160}
        className="rounded-full mx-auto shadow-lg"
      />
      <h1 className="text-3xl font-bold mt-6">{about.name}</h1>
      <h2 className="text-lg text-gray-500 dark:text-gray-400">{about.role}</h2>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{about.bio}</p>
    </div>
  );
}
