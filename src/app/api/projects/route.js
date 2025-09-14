import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "projects.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return new Response(data, { status: 200 });
}

export async function POST(req) {
  const newProject = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  const projects = JSON.parse(data);

  const project = { ...newProject, createdAt: new Date().toISOString() };
  projects.push(project);

  await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
  return new Response(JSON.stringify(project), { status: 201 });
}

export async function PUT(req) {
  const updated = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  let projects = JSON.parse(data);

  projects = projects.map((p) => (p.slug === updated.slug ? { ...p, ...updated } : p));

  await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req) {
  const { slug } = await req.json();
  const data = await fs.readFile(filePath, "utf-8");
  let projects = JSON.parse(data);

  projects = projects.filter((p) => p.slug !== slug);
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
