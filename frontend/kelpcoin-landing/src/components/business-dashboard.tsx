"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Coins, Leaf, ShoppingCart, MapPin, Calendar, User, QrCode, TrendingUp, Handshake } from "lucide-react"

interface Harvest {
  id: string
  farmerName: string
  farmName: string
  location: string
  date: string
  weight: number
  kelpCoins: number
  co2Removed: number
}

interface Offset {
  id: string
  farmerName: string
  farmName: string
  location: string
  datePurchased: string
  kelpCoins: number
  co2Offset: number
  status: "Completed" | "Pending"
}

interface BarterOffer {
  id: string
  farmerName: string
  farmName: string
  kelpCoinsOffered: number
  requestedService: string
  description: string
}

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("marketplace")

  // Mock data
  const businessStats = {
    totalKelpCoinsBought: 2450,
    totalCO2Offset: 24500, // kg
    availableKelpCoins: 8750,
    kelpCoinsBartered: 320,
  }

  const availableHarvests: Harvest[] = [
    {
      id: "1",
      farmerName: "Lucas Smith",
      farmName: "Seaside Kelp Farm",
      location: "Harborview Bay",
      date: "2024-06-10",
      weight: 1800,
      kelpCoins: 180,
      co2Removed: 1800,
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
    },
  ]

  const myOffsets: Offset[] = [
    {
      id: "1",
      farmerName: "Sarah Johnson",
      farmName: "Blue Wave Kelp",
      location: "Crystal Bay",
      datePurchased: "2024-06-05",
      kelpCoins: 200,
      co2Offset: 2000,
      status: "Completed",
    },
    {
      id: "2",
      farmerName: "Mike Thompson",
      farmName: "Ocean Harvest Farm",
      location: "Rocky Shore",
      datePurchased: "2024-06-03",
      kelpCoins: 150,
      co2Offset: 1500,
      status: "Completed",
    },
    {
      id: "3",
      farmerName: "Emma Wilson",
      farmName: "Tidal Gardens",
      location: "Seabreeze Point",
      datePurchased: "2024-06-01",
      kelpCoins: 180,
      co2Offset: 1800,
      status: "Pending",
    },
  ]

  const barterOffers: BarterOffer[] = [
    {
      id: "1",
      farmerName: "David Park",
      farmName: "Kelp Valley Farm",
      kelpCoinsOffered: 100,
      requestedService: "Catered Lunch",
      description: "Looking for 3 catered lunches for farm workers",
    },
    {
      id: "2",
      farmerName: "Lisa Chang",
      farmName: "Seaweed Solutions",
      kelpCoinsOffered: 75,
      requestedService: "Equipment Repair",
      description: "Need boat engine maintenance service",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">KelpCoins</h1>
              <span className="text-sm text-gray-500 hidden sm:inline">Business Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">BC</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Blue Café</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total KelpCoins Bought</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {businessStats.totalKelpCoinsBought.toLocaleString()}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total CO₂ Offset</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(businessStats.totalCO2Offset / 1000).toFixed(1)}t
                  </p>
                </div>
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available to Buy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {businessStats.availableKelpCoins.toLocaleString()}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">KelpCoins Bartered</p>
                  <p className="text-2xl font-bold text-purple-600">{businessStats.kelpCoinsBartered}</p>
                </div>
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="marketplace">Browse Harvests</TabsTrigger>
            <TabsTrigger value="offsets">My Offsets</TabsTrigger>
            <TabsTrigger value="barter">Barter Offers</TabsTrigger>
            <TabsTrigger value="impact">Impact Badge</TabsTrigger>
          </TabsList>

          {/* Browse Verified Harvests */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Browse Verified Harvests</h2>
              <p className="text-sm text-gray-600">{availableHarvests.length} harvests available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableHarvests.map((harvest) => (
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

                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white">Buy</Button>
                      <Button variant="outline" className="flex-1">
                        Barter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Offsets */}
          <TabsContent value="offsets" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">My Carbon Offsets</h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Farmer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Farm / Location</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">KelpCoins</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">CO₂ Offset</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOffsets.map((offset) => (
                          <tr key={offset.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-900">{offset.farmerName}</td>
                            <td className="py-4 px-4 text-gray-600">
                              {offset.farmName}, {offset.location}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(offset.datePurchased).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 font-medium text-yellow-600">{offset.kelpCoins}</td>
                            <td className="py-4 px-4 font-medium text-green-600">
                              {offset.co2Offset.toLocaleString()} kg
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                className={
                                  offset.status === "Completed"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                }
                              >
                                {offset.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {myOffsets.map((offset) => (
                <Card key={offset.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{offset.farmerName}</h3>
                        <p className="text-sm text-gray-600">
                          {offset.farmName}, {offset.location}
                        </p>
                      </div>
                      <Badge
                        className={
                          offset.status === "Completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {offset.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-medium">{new Date(offset.datePurchased).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">KelpCoins:</span>
                        <p className="font-medium text-yellow-600">{offset.kelpCoins}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">CO₂ Offset:</span>
                        <p className="font-medium text-green-600">{offset.co2Offset.toLocaleString()} kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Barter Offers */}
          <TabsContent value="barter" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Barter Opportunities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {barterOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Handshake className="w-5 h-5 mr-2 text-purple-600" />
                      {offer.farmerName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{offer.farmName}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-purple-800">Offering:</span>
                        <span className="font-bold text-purple-600">{offer.kelpCoinsOffered} KelpCoins</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-800">Requesting:</span>
                        <span className="font-medium text-purple-600">{offer.requestedService}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Make Barter Offer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Badge */}
          <TabsContent value="impact" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Your Impact Badge</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    QR Badge Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Blue Café</h3>
                    <p className="text-sm mb-4">This café offset</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {(businessStats.totalCO2Offset / 1000).toFixed(1)}t CO₂
                    </p>
                    <p className="text-sm mt-2">using local kelp farming</p>
                    <div className="mt-4 w-16 h-16 bg-white mx-auto rounded flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-800" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Scan to see our climate impact story</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Badge Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="w-4 h-4 mr-2" />
                      Download QR Badge (PNG)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="w-4 h-4 mr-2" />
                      Get Embed Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Public Impact Page
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Marketing Ideas:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Display on your storefront window</li>
                      <li>• Add to your menu or receipts</li>
                      <li>• Share on social media</li>
                      <li>• Include in email signatures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
