import { NextResponse } from "next/server";

/**
 * Fetch current file SHA from GitHub (needed to update instead of overwrite).
 */
async function getFileSha(path) {
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}?ref=${process.env.GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch file SHA:", res.status);
    return null;
  }

  const data = await res.json();
  return data.sha;
}

export async function POST(req) {
  try {
    const { filePath, content, message } = await req.json();

    if (!filePath || !content) {
      return NextResponse.json(
        { error: "Missing filePath or content" },
        { status: 400 }
      );
    }

    // Encode JSON to Base64
    const encoded = Buffer.from(
      JSON.stringify(content, null, 2)
    ).toString("base64");

    // Fetch existing file SHA (if it exists)
    const sha = await getFileSha(filePath);

    const res = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          branch: process.env.GITHUB_BRANCH,
          message: message || `Update ${filePath}`,
          content: encoded,
          sha,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("GitHub commit failed:", data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
