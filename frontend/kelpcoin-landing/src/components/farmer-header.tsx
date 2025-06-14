"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, LogOut } from "lucide-react"
import Link from "next/link"

export function FarmerHeader() {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/farmer" className="text-xl sm:text-2xl font-bold text-slate-800 no-underline">
                            KelpCoins
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
    )
} 