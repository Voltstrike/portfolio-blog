import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { slug } = req.query;

  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  try {
    const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (slug) {
      const project = projects.find(p => p.slug === slug);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }

    // Return all projects if no slug
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error reading projects' });
  }
}
