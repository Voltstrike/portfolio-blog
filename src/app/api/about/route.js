import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "about.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return new Response(data, { status: 200 });
}

export async function PUT(req) {
  const newAbout = await req.json();
  await fs.writeFile(filePath, JSON.stringify(newAbout, null, 2));
  return new Response(JSON.stringify(newAbout), { status: 200 });
}
