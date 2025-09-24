// src/app/api/about/route.js
import { NextResponse } from "next/server";

const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const branch = "main";
const filePath = "data/about.json";

export async function GET() {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch about.json" }, { status: 500 });
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return NextResponse.json(JSON.parse(content));
}

export async function PUT(req) {
  const body = await req.json();
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  // get current file sha
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const fileData = await getRes.json();
  const sha = fileData.sha;

  // commit new about.json
  const commit = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update about.json",
      content: Buffer.from(JSON.stringify(body, null, 2)).toString("base64"),
      branch,
      sha,
    }),
  });

  if (!commit.ok) {
    const err = await commit.json();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
