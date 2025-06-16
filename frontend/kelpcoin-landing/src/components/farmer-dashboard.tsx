"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Coins, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

interface HarvestSubmission {
  id: string
  date: string
  kelpMass: number
  status: "Pending" | "Approved" | "Rejected"
}

export default function FarmerDashboard() {
  // Mock data for harvest submissions
  const [submissions] = useState<HarvestSubmission[]>([
    { id: "1", date: "04/20/2024", kelpMass: 1200, status: "Rejected" },
    { id: "2", date: "04/12/2024", kelpMass: 3100, status: "Approved" },
    { id: "3", date: "03/03/2024", kelpMass: 1500, status: "Approved" },
    { id: "4", date: "03/28/2024", kelpMass: 2800, status: "Rejected" },
  ])

  const totalPhycoCoins = 1845

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-800 no-underline">
                PhycoCoins
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline">Farmer Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">LS</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Lucas Smith</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 text-white hover:bg-slate-700 border-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Dashboard Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 mt-4">
          {/* Submit Harvest Card */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-900">Submit Harvest</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Submit your seaweed harvest for validation and earn PhycoCoins for verified nutrient removal.
                </p>
                <Link href="/farmer/farmer-submit-harvest">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-semibold flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    Submit New Harvest
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PhycoCoin Earnings Card */}
          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
                <Coins className="w-6 h-6 mr-2 text-yellow-600" />
                My PhycoCoin Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-2">
                {totalPhycoCoins.toLocaleString()} PhycoCoins
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Earned from verified nutrient removal</p>
            </CardContent>
          </Card>
        </div>

        {/* Harvest Submissions Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-slate-800">Harvest Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelp Mass</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-900">{submission.date}</td>
                      <td className="py-4 px-4 text-gray-900">{submission.kelpMass.toLocaleString()} kg</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-gray-900">{submission.date}</div>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{submission.kelpMass.toLocaleString()} kg</div>
                  <div className="text-sm text-gray-500">Kelp Mass</div>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No harvest submissions yet. Submit your first harvest above!
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PhycoCoins</h3>
              <p className="text-gray-300 text-sm">
                A micro nutrient marketplace connecting seaweed farmers with local businesses for verified nutrient removal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About PhycoCoins
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-300">© {new Date().getFullYear()} PhycoCoins. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
