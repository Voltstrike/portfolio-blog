import { promises as fs } from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "articles.json")

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8")
  return new Response(data, { status: 200 })
}

export async function POST(req) {
  const newArticle = await req.json()
  const data = await fs.readFile(filePath, "utf-8")
  const articles = JSON.parse(data)

  articles.push({
    ...newArticle,
    id: Date.now(),
    date: new Date().toISOString()
  })

  await fs.writeFile(filePath, JSON.stringify(articles, null, 2))

  return new Response(JSON.stringify({ message: "Article added!" }), { status: 201 })
}
