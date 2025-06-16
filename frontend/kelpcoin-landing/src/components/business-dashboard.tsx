"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Coins,
  Leaf,
  ShoppingCart,
  MapPin,
  Calendar,
  User,
  QrCode,
  TrendingUp,
  Download,
  Code,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

interface HarvestData {
  walletAddress?: string; // Optional, can be added later
  harvestId: string;
  farmerName: string;
  farmName: string;
  wetBiomass: number;
  isDryInput: boolean;
  harvestDate: string;
  latitude: number;
  longitude: number;
  sensorData: {
    water_temperature: number;
    light_PAR: number;
    inorganic_nitrogen: number;
    total_phosphorus: number;
    secchi_depth: number;
  };
  validationResult: {
    feasible: boolean;
    q95_chlorophyll: number;
    q95_dry_biomass_lb: number;
    reported_input_biomass_lb: number;
    input_type: string;
    reported_dry_biomass_lb: number;
    ratio: number;
    carbon_lb: number;
    nitrogen_lb: number;
    phosphorus_lb: number;
    value_c_usd: number;
    value_n_usd: number;
    value_p_usd: number;
    total_usd: number;
    nutrientRemovals: {
      N_kg: number;
      P_kg: number;
      C_kg: number;
    };
  };
  submittedAt: string;
}

interface Harvest {
  walletAddress?: string; // Optional for now, can be added later
  id: string;
  farmerName: string;
  farmName: string;
  location: string;
  date: string;
  weight: number;
  kelpCoins: number;
  co2Removed: number;
  nitrogenRemoved: number;
  phosphorusRemoved: number;
  total_usd: number;
}

interface Offset {
  id: string;
  farmerName: string;
  farmName: string;
  location: string;
  datePurchased: string;
  kelpCoins: number;
  co2Offset: number;
  status: "Completed" | "Pending";
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);

  // Business info
  const businessInfo = {
    name: "Blue Café",
    id: "blue-cafe",
    website: "https://bluecafe.com",
  };

  // Mock data
  const businessStats = {
    totalKelpCoinsBought: 2450,
    totalCO2Offset: 24500, // kg
    availableKelpCoins: 8750,
  };

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
  ];

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await fetch("/api/harvests");
        if (!response.ok) throw new Error("Failed to fetch harvests");
        const data: HarvestData[] = await response.json();

        // Transform API data to match our display format
        const transformedHarvests: Harvest[] = data.map((harvest) => ({
          walletAddress: harvest.walletAddress, // Optional, can be added later
          id: harvest.harvestId,
          farmerName: harvest.farmerName, // Placeholder until we add farmer info
          farmName: harvest.farmName, // Placeholder until we add farm info
          location: `${harvest.latitude.toFixed(
            4
          )}, ${harvest.longitude.toFixed(4)}`,
          date: harvest.harvestDate,
          weight: harvest.wetBiomass,
          kelpCoins: Math.round(harvest.validationResult.total_usd), // Using total USD value as KelpCoins
          co2Removed: harvest.validationResult.nutrientRemovals.C_kg * 2.2, // Converting lbs to kg
          nitrogenRemoved: harvest.validationResult.nutrientRemovals.N_kg * 2.2,
          phosphorusRemoved:
            harvest.validationResult.nutrientRemovals.P_kg * 2.2,
          total_usd: harvest.validationResult.total_usd,
        }));

        setHarvests(transformedHarvests);
      } catch (error) {
        console.error("Error fetching harvests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvests();
  }, []);

  // Generate QR code URL for the business impact page
  const impactPageUrl = `${window.location.origin}/impact/${businessInfo.id}`;

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 256;
    canvas.height = 256;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${businessInfo.name}-impact-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Generate embed code
  const generateEmbedCode = () => {
    const embedCode = `<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1e293b, #475569); color: white; border-radius: 12px; max-width: 300px;">
  <h3 style="margin: 0 0 10px 0; font-size: 18px;">${businessInfo.name}</h3>
  <p style="margin: 0 0 15px 0; font-size: 14px;">This business offset</p>
  <p style="margin: 0 0 10px 0; font-size: 28px; color: #fbbf24; font-weight: bold;">${(
    businessStats.totalCO2Offset / 1000
  ).toFixed(1)}t Nutrient</p>
  <p style="margin: 0 0 15px 0; font-size: 12px;">using local seaweed farming</p>
  <img src="data:image/svg+xml;base64,${btoa(
    new XMLSerializer().serializeToString(
      document.getElementById("qr-code-svg") || document.createElement("svg")
    )
  )}" style="width: 64px; height: 64px; background: white; padding: 8px; border-radius: 8px;" />
  <p style="margin: 10px 0 0 0; font-size: 12px;">Scan to see our climate impact</p>
</div>`;

    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-slate-800 no-underline"
              >
                PhycoCoins
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Business Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">BC</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {businessInfo.name}
                </span>
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
                  <p className="text-sm font-medium text-gray-600">
                    Total PhycoCoins Bought
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Total nutrient Offset
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Available to Buy
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {businessStats.availableKelpCoins.toLocaleString()}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="marketplace">Browse Harvests</TabsTrigger>
            <TabsTrigger value="offsets">My Offsets</TabsTrigger>
            <TabsTrigger value="impact">Impact Badge</TabsTrigger>
          </TabsList>

          {/* Browse Verified Harvests */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">
                Browse Verified Harvests
              </h2>
              <p className="text-sm text-gray-600">
                {harvests.length} harvests available
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading harvests...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {harvests.map((harvest) => (
                  <Card
                    key={harvest.id}
                    className="hover:shadow-lg transition-shadow"
                  >
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
                          <span className="font-medium">
                            {harvest.weight.toLocaleString()} lb
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            PhycoCoins:
                          </span>
                          <span className="font-medium text-yellow-600">
                            {harvest.kelpCoins}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Carbon Removed:
                          </span>
                          <span className="font-medium text-green-600">
                            {harvest.co2Removed.toLocaleString()} lb
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Nitrogen Removed:
                          </span>
                          <span className="font-medium text-green-600">
                            {harvest.nitrogenRemoved.toLocaleString()} lb
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Phosphorus Removed:
                          </span>
                          <span className="font-medium text-green-600">
                            {harvest.phosphorusRemoved.toLocaleString()} lb
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white w-100"
                          onClick={() => {
                            router.push(
                              "http://localhost:3000?walletAddress=" +
                                harvest.walletAddress +
                                "&buyAmount=" +
                                harvest.kelpCoins
                            );
                          }}
                        >
                          Buy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Offsets */}
          <TabsContent value="offsets" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              My Carbon Offsets
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Farmer
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Farm / Location
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            PhycoCoins
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            CO₂ Offset
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOffsets.map((offset) => (
                          <tr
                            key={offset.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4 font-medium text-gray-900">
                              {offset.farmerName}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {offset.farmName}, {offset.location}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(
                                offset.datePurchased
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 font-medium text-yellow-600">
                              {offset.kelpCoins}
                            </td>
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
                        <h3 className="font-semibold text-slate-800">
                          {offset.farmerName}
                        </h3>
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
                        <p className="font-medium">
                          {new Date(offset.datePurchased).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">PhycoCoins:</span>
                        <p className="font-medium text-yellow-600">
                          {offset.kelpCoins}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Nutrient Offset:</span>
                        <p className="font-medium text-green-600">
                          {offset.co2Offset.toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Badge */}
          <TabsContent value="impact" className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Your Impact Badge
            </h2>

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
                    <h3 className="text-lg font-bold mb-2">
                      {businessInfo.name}
                    </h3>
                    <p className="text-sm mb-4">This business offset</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {(businessStats.totalCO2Offset / 1000).toFixed(1)}t
                      Nutrient
                    </p>
                    <p className="text-sm mt-2">using local seaweed farming</p>
                    <div className="mt-4 w-16 h-16 bg-white mx-auto rounded flex items-center justify-center p-2">
                      <QRCode
                        id="qr-code-svg"
                        value={impactPageUrl}
                        size={48}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan to see our climate impact story
                  </p>
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
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={downloadQRCode}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Badge (PNG)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={generateEmbedCode}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Get Embed Code
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={impactPageUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Public Impact Page
                      </Link>
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Marketing Ideas:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Display on your storefront window</li>
                      <li>• Add to your menu or receipts</li>
                      <li>• Share on social media</li>
                      <li>• Include in email signatures</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      QR Code Links To:
                    </h4>
                    <p className="text-sm text-green-700 break-all">
                      {impactPageUrl}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PhycoCoins</h3>
              <p className="text-gray-300 text-sm">
                A micro nutrient marketplace connecting seaweed farmers with
                local businesses for verified nutrient removal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white"
                  >
                    About PhycoCoins
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-gray-300 hover:text-white"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white"
                  >
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
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                © {new Date().getFullYear()} PhycoCoins. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
