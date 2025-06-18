"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { FarmerHeader } from "@/components/farmer-header"

export default function FarmerDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <FarmerHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ... rest of the content ... */}
                </div>
            </div>
        </div>
    )
} 