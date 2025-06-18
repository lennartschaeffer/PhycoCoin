import { NextResponse } from "next/server"

interface ExecuteTradeRequest {
    batchId: string
    coins: number
    pricePerCoin: number
}

export async function POST(request: Request) {
    const body: ExecuteTradeRequest = await request.json()
    const { batchId, coins, pricePerCoin } = body

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
        success: true,
        transactionId: `tx_${Date.now()}`,
        message: `Successfully purchased ${coins} KelpCoins for $${(coins * pricePerCoin).toFixed(2)}`,
    })
} 