import { NextResponse } from "next/server";

/**
 * Get latest file info from GitHub (SHA, content)
 */
async function getFileInfo(filePath) {
  const res = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${filePath}?ref=${process.env.GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    // File might not exist (new file)
    return null;
  }

  return await res.json();
}

/**
 * Handle POST requests from Admin panel
 */
export async function POST(req) {
  try {
    const { filePath, content, message } = await req.json();

    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH;
    const token = process.env.GITHUB_TOKEN;

    if (!repo || !branch || !token) {
      return NextResponse.json(
        { error: "Missing GitHub environment variables" },
        { status: 500 }
      );
    }

    // 1. Get latest file info (to grab SHA)
    const fileInfo = await getFileInfo(filePath);
    const sha = fileInfo?.sha;

    // 2. Prepare new file content
    const encodedContent = Buffer.from(
      typeof content === "string" ? content : JSON.stringify(content, null, 2)
    ).toString("base64");

    // 3. Commit the change
    const commitRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: message || `Update ${filePath}`,
          content: encodedContent,
          branch,
          sha, // ✅ include latest SHA to avoid 409 conflict
        }),
      }
    );

    const commitData = await commitRes.json();

    if (!commitRes.ok) {
      console.error("❌ Commit failed:", commitData);
      return NextResponse.json(commitData, { status: commitRes.status });
    }

    return NextResponse.json({ success: true, commit: commitData });
  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
