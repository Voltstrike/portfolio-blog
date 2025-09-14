export default function Footer() {
  return (
    <footer className="w-full bg-surface text-muted py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} Mikail Crito Husada. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://github.com/voltstrike" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/mikail-crito-husada/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            LinkedIn
          </a>
          <a href="mailto:mikailhusada@gmail.com" className="hover:text-primary transition">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
