"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-[#1e1333] text-white border-b border-pink-500/20">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-500">ft_transcendence</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-200 hover:text-pink-400 transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link
              href="#contact"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              Get Started
            </Link>
          </nav>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1e1333] border-t border-pink-500/20">
          <div className="container px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-200 hover:text-pink-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link
                href="#contact"
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
