import { NextResponse } from "next/server"

interface MintCoinsRequest {
    harvestId: string
}

export async function POST(request: Request) {
    const body: MintCoinsRequest = await request.json()
    const { harvestId } = body

    // Mock minting logic
    const breakdown = {
        nitrogen: Math.floor(Math.random() * 50) + 20, // 20-70 coins
        phosphorus: Math.floor(Math.random() * 30) + 10, // 10-40 coins
        carbon: Math.floor(Math.random() * 100) + 50, // 50-150 coins
    }

    const totalCoins = breakdown.nitrogen + breakdown.phosphorus + breakdown.carbon

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
        totalCoins,
        breakdown,
    })
} 