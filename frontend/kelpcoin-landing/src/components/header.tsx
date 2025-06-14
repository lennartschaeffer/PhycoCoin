"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-gradient-to-br from-gray-50 to-gray-200 py-4 md:py-5 relative z-50">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-5">
        <Link href="/" className="text-2xl md:text-5xl font-bold text-slate-800 no-underline">
          KelpCoins
        </Link>

        <div className="flex items-center space-x-3">
          <Link href="/farmer">
            <button className="text-sm font-medium px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              For Farmers
            </button>
          </Link>
          <Link href="/business">
            <button className="text-sm font-medium px-4 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition-colors">
              For Businesses
            </button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
