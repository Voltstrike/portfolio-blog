import { NextResponse } from "next/server";

const GITHUB_REPO = "Voltstrike/portfolio-blog";
const FILE_PATH = "data/articles.json";
const BRANCH = "main";
const TOKEN = process.env.GITHUB_TOKEN;

async function fetchFile() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch file");
  return res.json();
}

async function saveFile(updatedContent, sha) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update articles.json via Admin",
      content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString("base64"),
      sha,
      branch: "main",
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to save file");
  }
  return res.json();
}

// ✅ PUT (update article)
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updatedArticle = await req.json();
    const file = await fetchFile();
    let articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));

    articles = articles.map((a) => (String(a.id) === String(id) ? updatedArticle : a));

    await saveFile(articles, file.sha);
    return NextResponse.json(updatedArticle);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE (remove article)
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const file = await fetchFile();
    let articles = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));

    articles = articles.filter((a) => String(a.id) !== String(id));

    await saveFile(articles, file.sha);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
