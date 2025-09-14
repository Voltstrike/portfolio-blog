import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "articles.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return new Response(data, { status: 200 });
}

export async function POST(req) {
  const newArticle = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  const articles = JSON.parse(data);

  const article = { ...newArticle, createdAt: new Date().toISOString() };
  articles.push(article);

  await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
  return new Response(JSON.stringify(article), { status: 201 });
}

export async function PUT(req) {
  const updated = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  let articles = JSON.parse(data);

  articles = articles.map((a) => (a.slug === updated.slug ? { ...a, ...updated } : a));

  await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req) {
  const { slug } = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  let articles = JSON.parse(data);

  articles = articles.filter((a) => a.slug !== slug);
  await fs.writeFile(filePath, JSON.stringify(articles, null, 2));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
