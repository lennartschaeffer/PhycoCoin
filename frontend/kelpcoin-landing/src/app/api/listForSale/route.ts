import { NextResponse } from "next/server"

interface ListForSaleRequest {
    harvestId: string
    coins: number
    pricePerCoin: number
}

export async function POST(request: Request) {
    const body: ListForSaleRequest = await request.json()
    const { harvestId, coins, pricePerCoin } = body

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
        success: true,
        listingId: `listing_${Date.now()}`,
        message: `Successfully listed ${coins} KelpCoins for sale at $${pricePerCoin} each`,
    })
} 