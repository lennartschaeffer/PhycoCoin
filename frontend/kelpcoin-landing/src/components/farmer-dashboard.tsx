"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Coins } from "lucide-react"

interface HarvestSubmission {
  id: string
  date: string
  kelpMass: number
  status: "Pending" | "Approved" | "Rejected"
}

export default function FarmerDashboard() {
  const [kelpMass, setKelpMass] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for harvest submissions
  const [submissions] = useState<HarvestSubmission[]>([
    { id: "1", date: "04/20/2024", kelpMass: 1200, status: "Pending" },
    { id: "2", date: "04/12/2024", kelpMass: 3100, status: "Approved" },
    { id: "3", date: "03/03/2024", kelpMass: 1500, status: "Approved" },
    { id: "4", date: "03/28/2024", kelpMass: 2800, status: "Rejected" },
  ])

  const totalKelpCoins = 1845

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!kelpMass) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setKelpMass("")
    // In a real app, you would add the new submission to the list
  }

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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">KelpCoins</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Submit Harvest Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-slate-800">Submit Harvest</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="kelpMass" className="block text-sm font-medium text-gray-700 mb-2">
                    Kelp Mass (kg)
                  </label>
                  <Input
                    id="kelpMass"
                    type="number"
                    value={kelpMass}
                    onChange={(e) => setKelpMass(e.target.value)}
                    placeholder="Enter kelp mass in kg"
                    className="text-lg py-3 px-4"
                    min="1"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !kelpMass}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* KelpCoin Earnings Card */}
          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-slate-800 flex items-center">
                <Coins className="w-6 h-6 mr-2 text-yellow-600" />
                My KelpCoin Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-2">
                {totalKelpCoins.toLocaleString()} KelpCoins
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Earned from verified CO₂ removal</p>
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
    </div>
  )
}
