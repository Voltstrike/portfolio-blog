"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-surface shadow-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          MyPortfolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-light">
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/projects" className="hover:text-primary transition">Projects</Link>
          <Link href="/articles" className="hover:text-primary transition">Articles</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-surface px-6 py-4 space-y-4">
          <Link href="/about" className="block hover:text-primary transition">About</Link>
          <Link href="/projects" className="block hover:text-primary transition">Projects</Link>
          <Link href="/articles" className="block hover:text-primary transition">Articles</Link>
          <Link href="/contact" className="block hover:text-primary transition">Contact</Link>
        </div>
      )}
    </nav>
  );
}
