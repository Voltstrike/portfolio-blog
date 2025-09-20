import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH;
const token = process.env.GITHUB_TOKEN;
const path = "data/projects.json";

async function fetchFile() {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: { Authorization: `token ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch file");
  return res.json();
}

async function commitFile(content, sha, message) {
  return await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
      sha,
      branch,
    }),
  });
}

export async function GET() {
  try {
    const file = await fetchFile();
    const projects = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const file = await fetchFile();
    const sha = file.sha;
    const projects = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    const newProject = { id: Date.now(), ...body, date: new Date().toISOString() };
    projects.push(newProject);

    const commitRes = await commitFile(projects, sha, `Add project: ${body.title}`);
    if (!commitRes.ok) throw new Error("Failed to commit new project");

    return NextResponse.json(newProject);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const file = await fetchFile();
    const sha = file.sha;
    let projects = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    projects = projects.map((p) => (p.id === body.id ? { ...p, ...body } : p));

    const commitRes = await commitFile(projects, sha, `Update project: ${body.title}`);
    if (!commitRes.ok) throw new Error("Failed to update project");

    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const file = await fetchFile();
    const sha = file.sha;
    let projects = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    projects = projects.filter((p) => p.id !== id);

    const commitRes = await commitFile(projects, sha, `Delete project id: ${id}`);
    if (!commitRes.ok) throw new Error("Failed to delete project");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
