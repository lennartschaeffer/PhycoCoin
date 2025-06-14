"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Calendar,
  User,
  Building,
  Leaf,
  TrendingUp,
  Award,
  Coins,
  Users,
  Factory,
  CheckCircle,
  Star,
  Handshake,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Harvest {
  id: string
  farmerName: string
  farmName: string
  location: string
  date: string
  weight: number
  kelpCoins: number
  co2Removed: number
  verificationDate: string
}

interface Business {
  id: string
  name: string
  totalKelpCoins: number
  co2Offset: number
  lastOffsetDate: string
  logo?: string
}

interface Farmer {
  id: string
  name: string
  totalKelpCoins: number
  totalKelpSubmitted: number
  verifiedSubmissions: number
  location: string
}

interface SpotlightStory {
  id: string
  title: string
  description: string
  type: "Offset" | "Barter" | "Press" | "Testimonial"
  image?: string
}

export default function MarketplaceOverview() {
  const [activeTab, setActiveTab] = useState("feed")
  const [filterRegion, setFilterRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const ecosystemStats = {
    totalKelpCoinsMinted: 12450,
    totalCO2Removed: 124500, // kg
    farmersParticipating: 28,
    businessesOffsetting: 42,
  }

  const harvests: Harvest[] = [
    {
      id: "1",
      farmerName: "Lucas Smith",
      farmName: "Seaside Kelp Farm",
      location: "Harborview Bay",
      date: "2024-06-10",
      weight: 1800,
      kelpCoins: 180,
      co2Removed: 1800,
      verificationDate: "2024-06-12",
    },
    {
      id: "2",
      farmerName: "Maria Rodriguez",
      farmName: "Coastal Harvest Co.",
      location: "Moonlight Cove",
      date: "2024-06-09",
      weight: 2300,
      kelpCoins: 230,
      co2Removed: 2300,
      verificationDate: "2024-06-11",
    },
    {
      id: "3",
      farmerName: "James Chen",
      farmName: "Pacific Kelp Gardens",
      location: "Sunset Point",
      date: "2024-06-08",
      weight: 1500,
      kelpCoins: 150,
      co2Removed: 1500,
      verificationDate: "2024-06-10",
    },
    {
      id: "4",
      farmerName: "Emma Wilson",
      farmName: "Tidal Gardens",
      location: "Seabreeze Point",
      date: "2024-06-05",
      weight: 2100,
      kelpCoins: 210,
      co2Removed: 2100,
      verificationDate: "2024-06-07",
    },
    {
      id: "5",
      farmerName: "David Park",
      farmName: "Kelp Valley Farm",
      location: "Rocky Shore",
      date: "2024-06-04",
      weight: 1900,
      kelpCoins: 190,
      co2Removed: 1900,
      verificationDate: "2024-06-06",
    },
  ]

  const topBusinesses: Business[] = [
    {
      id: "1",
      name: "Ocean Breeze Café",
      totalKelpCoins: 850,
      co2Offset: 8500,
      lastOffsetDate: "2024-06-08",
    },
    {
      id: "2",
      name: "Coastal Brewery",
      totalKelpCoins: 720,
      co2Offset: 7200,
      lastOffsetDate: "2024-06-10",
    },
    {
      id: "3",
      name: "Seaside Hotel",
      totalKelpCoins: 650,
      co2Offset: 6500,
      lastOffsetDate: "2024-06-05",
    },
    {
      id: "4",
      name: "Harbor Restaurant",
      totalKelpCoins: 580,
      co2Offset: 5800,
      lastOffsetDate: "2024-06-09",
    },
    {
      id: "5",
      name: "Bay Area Tours",
      totalKelpCoins: 450,
      co2Offset: 4500,
      lastOffsetDate: "2024-06-07",
    },
  ]

  const topFarmers: Farmer[] = [
    {
      id: "1",
      name: "Lucas Smith",
      totalKelpCoins: 1250,
      totalKelpSubmitted: 12500,
      verifiedSubmissions: 18,
      location: "Harborview Bay",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      totalKelpCoins: 980,
      totalKelpSubmitted: 9800,
      verifiedSubmissions: 14,
      location: "Moonlight Cove",
    },
    {
      id: "3",
      name: "James Chen",
      totalKelpCoins: 870,
      totalKelpSubmitted: 8700,
      verifiedSubmissions: 12,
      location: "Sunset Point",
    },
    {
      id: "4",
      name: "Emma Wilson",
      totalKelpCoins: 750,
      totalKelpSubmitted: 7500,
      verifiedSubmissions: 10,
      location: "Seabreeze Point",
    },
    {
      id: "5",
      name: "David Park",
      totalKelpCoins: 680,
      totalKelpSubmitted: 6800,
      verifiedSubmissions: 9,
      location: "Rocky Shore",
    },
  ]

  const spotlightStories: SpotlightStory[] = [
    {
      id: "1",
      title: "Offset of the Week",
      description:
        "Ocean Breeze Café offset 500kg of CO₂ this week by partnering with Seaside Kelp Farm, making it their largest offset to date!",
      type: "Offset",
    },
    {
      id: "2",
      title: "Top Barter Match",
      description:
        "Mike's Fuel Station bartered 50 KelpCoins with GreenBay Kelp in exchange for boat maintenance services, creating a win-win local partnership.",
      type: "Barter",
    },
    {
      id: "3",
      title: "Local Press: 'KelpCoins Revolutionizing Coastal Economy'",
      description:
        "The Coastal Times featured KelpCoins in their latest issue, highlighting how the platform is creating new economic opportunities for local communities.",
      type: "Press",
    },
  ]

  // Filter harvests based on selected filters and search query
  const filteredHarvests = harvests.filter((harvest) => {
    // Filter by region
    if (filterRegion !== "all" && harvest.location !== filterRegion) {
      return false
    }

    

    // Filter by search query
    if (
      searchQuery &&
      !harvest.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !harvest.farmName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !harvest.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-slate-800 no-underline">
                KelpCoins
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline">Marketplace</span>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/farmer">
                <Button variant="outline" size="sm" className="text-sm">
                  For Farmers
                </Button>
              </Link>
              <Link href="/business">
                <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white text-sm">
                  For Businesses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">KelpCoin Marketplace</h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-6">
              A transparent, community-powered carbon marketplace connecting local seaweed farmers with businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/join-business">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Offset Your Carbon
                </Button>
              </Link>
              <Link href="/join-farmer">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Start Earning KelpCoins
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Stats */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">
                {ecosystemStats.totalKelpCoinsMinted.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">KelpCoins Minted</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">
                {(ecosystemStats.totalCO2Removed / 1000).toFixed(1)}t
              </div>
              <div className="text-sm text-gray-600">CO₂ Removed</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">{ecosystemStats.farmersParticipating}</div>
              <div className="text-sm text-gray-600">Farmers Participating</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Factory className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">{ecosystemStats.businessesOffsetting}</div>
              <div className="text-sm text-gray-600">Businesses Offsetting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="feed">Live Marketplace</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="spotlight">Spotlight</TabsTrigger>
          </TabsList>

          {/* Live Marketplace Feed */}
          <TabsContent value="feed" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-semibold text-slate-800">Browse Verified Harvests</h2>

              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search harvests..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger className="w-full sm:w-40 bg-white border border-gray-300 shadow-sm">
                        <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="Harborview Bay">Harborview Bay</SelectItem>
                        <SelectItem value="Moonlight Cove">Moonlight Cove</SelectItem>
                        <SelectItem value="Sunset Point">Sunset Point</SelectItem>
                        <SelectItem value="Seabreeze Point">Seabreeze Point</SelectItem>
                        <SelectItem value="Rocky Shore">Rocky Shore</SelectItem>
                    </SelectContent>
                  </Select>

                  
                </div>
              </div>
            </div>

            {filteredHarvests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No harvests found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHarvests.map((harvest) => (
                  <Card key={harvest.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {harvest.farmerName}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {harvest.farmName}, {harvest.location}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(harvest.date).toLocaleDateString()}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Weight:</span>
                          <span className="font-medium">{harvest.weight.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">KelpCoins:</span>
                          <span className="font-medium text-yellow-600">{harvest.kelpCoins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">CO₂ Removed:</span>
                          <span className="font-medium text-green-600">{harvest.co2Removed.toLocaleString()} kg</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                        Verified by ML on {new Date(harvest.verificationDate).toLocaleDateString()}
                      </div>

                      
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Offsetters (Businesses) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Top Offsetters (Businesses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topBusinesses.map((business, index) => (
                      <div
                        key={business.id}
                        className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">{business.name}</h4>
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Coins className="w-3 h-3 mr-1 text-yellow-600" />
                              {business.totalKelpCoins} KelpCoins
                            </span>
                            <span className="flex items-center">
                              <Leaf className="w-3 h-3 mr-1 text-green-600" />
                              {(business.co2Offset / 1000).toFixed(1)}t CO₂
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors (Farmers) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Top Contributors (Farmers)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topFarmers.map((farmer, index) => (
                      <div
                        key={farmer.id}
                        className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800">{farmer.name}</h4>
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Coins className="w-3 h-3 mr-1 text-yellow-600" />
                              {farmer.totalKelpCoins} KelpCoins
                            </span>
                            <span className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1 text-blue-600" />
                              {farmer.verifiedSubmissions} Submissions
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Leaderboards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Most Offsets This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topBusinesses.slice(0, 3).map((business, index) => (
                      <div key={`weekly-${business.id}`} className="flex items-center py-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center mr-2 text-xs">
                          {index + 1}
                        </div>
                        <span className="flex-1 font-medium text-gray-800">{business.name}</span>
                        <span className="text-sm text-purple-600 font-medium">
                          {Math.round(business.totalKelpCoins * 0.2)} KelpCoins
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Handshake className="w-5 h-5 mr-2 text-orange-600" />
                    Most Active Barterers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...topFarmers, ...topBusinesses]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 3)
                      .map((entity, index) => (
                        <div key={`barter-${entity.id}`} className="flex items-center py-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-bold flex items-center justify-center mr-2 text-xs">
                            {index + 1}
                          </div>
                          <span className="flex-1 font-medium text-gray-800">{entity.name}</span>
                          <span className="text-sm text-orange-600 font-medium">
                            {Math.round(Math.random() * 50 + 10)} Barters
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Spotlight Section */}
          <TabsContent value="spotlight" className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800">Community Spotlight</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightStories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <div
                    className={`h-2 ${
                      story.type === "Offset"
                        ? "bg-green-500"
                        : story.type === "Barter"
                          ? "bg-purple-500"
                          : story.type === "Press"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                    }`}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        className={
                          story.type === "Offset"
                            ? "bg-green-100 text-green-800"
                            : story.type === "Barter"
                              ? "bg-purple-100 text-purple-800"
                              : story.type === "Press"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {story.type}
                      </Badge>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{story.description}</p>
                    <Button variant="link" className="mt-2 p-0 h-auto text-blue-600">
                      Read full story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Story */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 text-white overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 mr-2 text-yellow-400" />
                  <h3 className="text-xl font-semibold">Featured Success Story</h3>
                </div>
                <h4 className="text-2xl font-bold mb-4">
                  How Ocean Breeze Café Achieved Carbon Neutrality with Local Kelp
                </h4>
                <p className="text-gray-200 mb-6">
                  &quot;Working with local kelp farmers through KelpCoins has transformed our business. Not only have we
                  offset our carbon footprint, but we&apos;ve built meaningful relationships with local producers and seen a
                  20% increase in customer engagement.&quot;
                </p>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-800 font-bold mr-3">
                    OB
                  </div>
                  <div>
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-gray-300">Owner, Ocean Breeze Café</div>
                  </div>
                </div>
                <Button className="bg-white text-slate-800 hover:bg-gray-100">Read Their Story</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-12 sm:py-16 border-t border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">Join the KelpCoin Community</h2>
          <p className="text-lg text-green-700 max-w-2xl mx-auto mb-8">
            Whether you&apos;re a seaweed farmer or a business looking to offset your carbon footprint, KelpCoins connects
            you to a sustainable, local carbon marketplace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join-business">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Building className="w-5 h-5 mr-2" />
                For Businesses
              </Button>
            </Link>
            <Link href="/join-farmer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="w-5 h-5 mr-2" />
                For Farmers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">KelpCoins</h3>
              <p className="text-gray-300 text-sm">
                A micro carbon marketplace connecting seaweed farmers with local businesses for verified carbon removal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About KelpCoins
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
              <p className="mt-4 text-sm text-gray-300">© {new Date().getFullYear()} KelpCoins. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
