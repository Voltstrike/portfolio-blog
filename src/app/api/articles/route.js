import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH;
const token = process.env.GITHUB_TOKEN;
const path = "data/articles.json";

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
    const articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    return NextResponse.json(articles);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const file = await fetchFile();
    const sha = file.sha;
    const articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    const newArticle = { id: Date.now(), ...body, date: new Date().toISOString() };
    articles.push(newArticle);

    const commitRes = await commitFile(articles, sha, `Add article: ${body.title}`);
    if (!commitRes.ok) throw new Error("Failed to commit new article");

    return NextResponse.json(newArticle);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const file = await fetchFile();
    const sha = file.sha;
    let articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    articles = articles.map((a) => (a.id === body.id ? { ...a, ...body } : a));

    const commitRes = await commitFile(articles, sha, `Update article: ${body.title}`);
    if (!commitRes.ok) throw new Error("Failed to update article");

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
    let articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));

    articles = articles.filter((a) => a.id !== id);

    const commitRes = await commitFile(articles, sha, `Delete article id: ${id}`);
    if (!commitRes.ok) throw new Error("Failed to delete article");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
