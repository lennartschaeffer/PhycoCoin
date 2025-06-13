"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-br from-gray-50 to-gray-200 py-4 md:py-5 relative z-50">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-5">
        <Link href="/" className="text-2xl md:text-5xl font-bold text-slate-800 no-underline">
          KelpCoins
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          <Link href="#" className="no-underline font-medium text-gray-700 hover:text-slate-800 transition-colors">
            About
          </Link>
          <Link href="#" className="no-underline font-medium text-gray-700 hover:text-slate-800 transition-colors">
            Join
          </Link>
          <Link
            href="#"
            className="bg-slate-800 text-white px-6 py-3 rounded-full no-underline font-semibold transition-all duration-300 shadow-lg hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Log in
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="#"
                className="no-underline font-medium text-gray-700 hover:text-slate-800 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#"
                className="no-underline font-medium text-gray-700 hover:text-slate-800 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Join
              </Link>
              <Link
                href="#"
                className="bg-slate-800 text-white px-6 py-3 rounded-full no-underline font-semibold text-center transition-all duration-300 shadow-lg hover:bg-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
