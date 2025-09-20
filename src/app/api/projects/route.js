import { NextResponse } from "next/server";

const GITHUB_REPO = "Voltstrike/portfolio-blog"; // your repo
const FILE_PATH = "data/projects.json"; // where articles live
const BRANCH = "main";
const TOKEN = process.env.GITHUB_TOKEN;

// ✅ Fetch file content from GitHub
async function fetchFile() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch file from GitHub");
  return res.json();
}

// ✅ Save updated JSON to GitHub
async function saveFile(updatedContent, sha) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update projects.json via Admin",
      content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString("base64"),
      sha,
      branch: BRANCH,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to save file to GitHub");
  }
  return res.json();
}

// ✅ GET all articles
export async function GET() {
  try {
    const file = await fetchFile();
    const data = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ POST new article
export async function POST(req) {
  try {
    const newProjects= await req.json();
    const file = await fetchFile();
    const projects = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));

    projects.push(newProjects);
    await saveFile(projects, file.sha);

    return NextResponse.json(newProjects);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
