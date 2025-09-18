import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { slug } = req.query;

  const filePath = path.join(process.cwd(), 'data', 'articles.json');
  try {
    const articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (slug) {
      const article = articles.find(a => a.slug === slug);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      return res.status(200).json(article);
    }

    // Return all articles if no slug
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error reading articles' });
  }
}
