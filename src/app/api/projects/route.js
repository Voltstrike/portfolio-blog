// app/api/projects/route.js
import { promises as fs } from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "projects.json")

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8")
  return new Response(data, { status: 200 })
}

export async function POST(req) {
  const newProject = await req.json()
  const data = await fs.readFile(filePath, "utf-8")
  const projects = JSON.parse(data)

  projects.push(newProject)
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2))

  return new Response(JSON.stringify({ message: "Project added!" }), { status: 201 })
}
