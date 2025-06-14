import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    console.log("/api/generateHarvestCode POST body:", body)
    const { harvestId } = body
    // Generate a random 6-digit code as a string
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("Generated code:", code)
    // In a real app, you might store this code with the harvestId in a DB
    return NextResponse.json({ code })
} 